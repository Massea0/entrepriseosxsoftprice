import { createClient } from '@supabase/supabase-js';

// Vérifier les variables d'environnement
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL or SUPABASE_URL must be set in .env");
}

if (!SUPABASE_SERVICE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY must be set in .env");
}

// Client Supabase pour le backend avec service role key
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    realtime: {
      params: {
        eventsPerSecond: 0
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'enterprise-os/1.0'
      }
    }
  }
);

// Export pour compatibilité (remplace db)
export const db = supabase;