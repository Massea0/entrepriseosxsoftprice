-- =====================================================
-- POLICIES RLS ADAPTÉES POUR VOTRE STRUCTURE
-- Date: 2025-07-29
-- Description: Policies RLS pour la structure avec table 'users'
-- =====================================================

-- =====================================================
-- COMPANIES POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "companies_read_authenticated" ON companies
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- USERS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "users_read_authenticated" ON users
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Modification de son propre profil
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- EMPLOYEES POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "employees_read_authenticated" ON employees
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "projects_read_authenticated" ON projects
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- TASKS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "tasks_read_authenticated" ON tasks
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- INVOICES POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "invoices_read_authenticated" ON invoices
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- DEVIS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "devis_read_authenticated" ON devis
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- CONTRACTS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "contracts_read_authenticated" ON contracts
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- AI_AGENTS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "ai_agents_read_authenticated" ON ai_agents
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- TICKETS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "tickets_read_authenticated" ON tickets
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- WORKFLOWS POLICIES
-- =====================================================

-- Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "workflows_read_authenticated" ON workflows
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- Note: Ces policies sont basiques pour commencer
-- Vous pourrez les affiner plus tard selon les rôles
-- =====================================================