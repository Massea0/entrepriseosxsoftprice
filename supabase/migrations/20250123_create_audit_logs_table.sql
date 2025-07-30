-- Create audit_logs table for tracking administrative actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100),
    target_id UUID,
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_target ON public.audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Only super admins and admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- No one can modify audit logs (immutable)
CREATE POLICY "No one can modify audit logs" ON public.audit_logs
    FOR ALL
    USING (false);

-- Create function to log actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_action VARCHAR,
    p_target_type VARCHAR DEFAULT NULL,
    p_target_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        target_type,
        target_id,
        details
    ) VALUES (
        auth.uid(),
        p_action,
        p_target_type,
        p_target_id,
        p_details
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;

-- Create trigger to automatically log profile updates
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Only log if an admin is making the change and it's not the user updating their own profile
        IF EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
            AND auth.uid() != NEW.id
        ) THEN
            PERFORM public.log_admin_action(
                'user.profile_updated',
                'user',
                NEW.id,
                jsonb_build_object(
                    'old_values', to_jsonb(OLD),
                    'new_values', to_jsonb(NEW),
                    'changed_fields', (
                        SELECT jsonb_object_agg(key, value)
                        FROM jsonb_each(to_jsonb(NEW))
                        WHERE to_jsonb(OLD)->>key IS DISTINCT FROM value::text
                    )
                )
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on profiles table
CREATE TRIGGER log_profile_updates
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.log_profile_changes();

-- Add some common audit log types as comments for reference
COMMENT ON TABLE public.audit_logs IS 'Stores all administrative actions for compliance and security auditing';
COMMENT ON COLUMN public.audit_logs.action IS 'Action types: user.created, user.updated, user.deleted, user.role_changed, user.password_reset, user.locked, user.unlocked, bulk_action.performed, security.settings_changed, etc.';
COMMENT ON COLUMN public.audit_logs.details IS 'Additional context about the action in JSON format';