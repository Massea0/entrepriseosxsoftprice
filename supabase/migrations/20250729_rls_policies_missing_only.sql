-- =====================================================
-- POLICIES RLS POUR LES NOUVELLES TABLES SEULEMENT
-- Date: 2025-07-29
-- Description: Ajoute des policies SEULEMENT pour les tables RH
-- =====================================================

-- =====================================================
-- LEAVE_TYPES POLICIES
-- =====================================================

-- HR managers peuvent gérer les types de congés
CREATE POLICY "HR managers can manage leave types" ON leave_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'hr_manager', 'hr_admin')
    )
  );

-- Tous les employés peuvent voir les types de congés
CREATE POLICY "Employees can view leave types" ON leave_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- =====================================================
-- LEAVE_REQUESTS POLICIES
-- =====================================================

-- Les employés peuvent créer leurs propres demandes
CREATE POLICY "Employees can create own leave requests" ON leave_requests
  FOR INSERT
  WITH CHECK (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- Les employés peuvent voir leurs propres demandes
CREATE POLICY "Employees can view own leave requests" ON leave_requests
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- Les managers peuvent voir les demandes de leur équipe
CREATE POLICY "Managers can view team leave requests" ON leave_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees e1
      JOIN employees e2 ON e1.id = e2.manager_id
      WHERE e1.user_id = auth.uid()
      AND e2.id = leave_requests.employee_id
    )
  );

-- Les managers peuvent approuver/rejeter les demandes
CREATE POLICY "Managers can update team leave requests" ON leave_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM employees e1
      JOIN employees e2 ON e1.id = e2.manager_id
      WHERE e1.user_id = auth.uid()
      AND e2.id = leave_requests.employee_id
    )
  );

-- HR peut tout gérer
CREATE POLICY "HR can manage all leave requests" ON leave_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'hr_manager', 'hr_admin')
    )
  );

-- =====================================================
-- LEAVE_BALANCES POLICIES
-- =====================================================

-- Les employés peuvent voir leurs propres soldes
CREATE POLICY "Employees can view own leave balances" ON leave_balances
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- HR peut gérer tous les soldes
CREATE POLICY "HR can manage all leave balances" ON leave_balances
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'hr_manager', 'hr_admin')
    )
  );

-- Les managers peuvent voir les soldes de leur équipe
CREATE POLICY "Managers can view team leave balances" ON leave_balances
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees e1
      JOIN employees e2 ON e1.id = e2.manager_id
      WHERE e1.user_id = auth.uid()
      AND e2.id = leave_balances.employee_id
    )
  );

-- =====================================================
-- Note: Les tables existantes ont déjà des policies
-- très complètes, on n'y touche pas
-- =====================================================