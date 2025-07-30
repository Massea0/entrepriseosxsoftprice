import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMenuItemsByRole } from '@/components/layout/AppSidebar';

// Utilise la fonction exportée depuis AppSidebar
const getDebugMenuItemsByRole = (userRole: string) => {
  // Pour debug, on utilise directement la fonction importée
  return getMenuItemsByRole(userRole);
};

// Version alternative pour debug si nécessaire
const getDebugMenuItemsByRoleDetailed = (userRole: string) => {
  const baseItems = [
    {
      title: "🧠 Synapse Live",
      url: "/synapse",
      icon: "Mic",
      roles: ['admin', 'super_admin', 'manager', 'client', 'employee']
    },
  ];

  switch (userRole) {
    case 'admin':
    case 'super_admin':
      return [
        {
          title: "Dashboard Admin",
          url: "/admin/dashboard",
          icon: "Shield",
          roles: ['admin', 'super_admin'],
        },
        {
          title: "⚡ Phase 2 Demo",
          url: "/admin/enhanced",
          icon: "Sparkles",
          roles: ['admin', 'super_admin'],
        },
        ...baseItems,
        {
          title: "🏗️ Projets",
          icon: "FolderKanban",
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Liste des Projets", url: "/projects", icon: "Building2" },
            { title: "Vue Kanban", url: "/projects/kanban", icon: "FolderKanban" },
            { title: "Timeline", url: "/projects/timeline", icon: "BarChart3" },
            { title: "Créer un Projet", url: "/projects/new", icon: "FileCheck" },
          ]
        },
        {
          title: "💼 Business",
          icon: "DollarSign",
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Factures", url: "/invoices", icon: "Receipt" },
            { title: "Devis", url: "/quotes", icon: "FileText" },
            { title: "Contrats", url: "/contracts", icon: "ScrollText" },
            { title: "Paiements", url: "/payments", icon: "CreditCard" },
            { title: "Rapports Financiers", url: "/financial-reports", icon: "Calculator" },
          ]
        },
        {
          title: "👥 Gestion RH",
          icon: "Users",
          roles: ['admin', 'super_admin', 'hr_manager'],
          submenu: [
            { title: "Tableau de Bord", url: "/hr", icon: "BarChart3" },
            { title: "Employés", url: "/hr/employees", icon: "Users" },
            { title: "Recrutement", url: "/hr/recruitment", icon: "Briefcase" },
            { title: "Départements", url: "/hr/departments", icon: "Building2" },
            { title: "Organisation", url: "/hr/organization", icon: "Network" },
          ]
        },
        {
          title: "🤖 Intelligence Artificielle",
          icon: "Brain",
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "AI Insights", url: "/ai/insights", icon: "Brain" },
            { title: "Prédictions", url: "/ai/predictions", icon: "TrendingUp" },
            { title: "Assignation Auto", url: "/ai/auto-assign", icon: "Zap" },
            { title: "Natural Voice", url: "/ai/voice", icon: "Mic" },
          ]
        },
        {
          title: "Configuration Système",
          url: "/admin/config",
          icon: "Settings",
          roles: ['admin', 'super_admin'],
        },
        {
          title: "🛡️ Administration",
          icon: "Shield",
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Vue Globale", url: "/admin/overview", icon: "BarChart3" },
            { title: "Gestion Utilisateurs", url: "/admin/users", icon: "Users" },
            { title: "Workflows", url: "/admin/workflows", icon: "Workflow" },
            { title: "Support", url: "/admin/support", icon: "MessageSquare" },
            { title: "Sécurité", url: "/admin/security", icon: "Shield" },
          ]
        },
        {
          title: "Vue Entreprise",
          icon: "Building2",
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Analytics Globaux", url: "/admin/analytics", icon: "BarChart3" },
            { title: "Métriques RH", url: "/admin/hr-metrics", icon: "Users" },
            { title: "Performance", url: "/admin/performance", icon: "TrendingUp" },
            { title: "Intégrations", url: "/admin/integrations", icon: "Link" },
            { title: "Quantum OS", url: "/admin/quantum", icon: "Sparkles" },
          ]
        },
      ];
    default:
      return baseItems;
  }
};

export default function DebugSidebar() {
  const { user } = useAuth();
  const userRole = user?.role || 'unknown';
  const menuItems = getDebugMenuItemsByRole(userRole);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug Sidebar</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email || 'Non connecté'}</p>
              <p><strong>Rôle:</strong> {userRole}</p>
              <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
              <p><strong>Nom complet:</strong> {user?.firstName} {user?.lastName}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menus Disponibles ({menuItems.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    URL: {item.url || 'Pas d\'URL (menu avec sous-menus)'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rôles: {item.roles.join(', ')}
                  </p>
                  {item.submenu && (
                    <div className="mt-2 ml-4 space-y-1">
                      <p className="text-sm font-medium">Sous-menus:</p>
                      {item.submenu.map((sub, subIndex) => (
                        <div key={subIndex} className="text-sm text-muted-foreground ml-2">
                          • {sub.title} ({sub.url})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>État Local Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>auth_token:</strong> {localStorage.getItem('auth_token') || 'Non défini'}</p>
              <p><strong>auth_user:</strong> {localStorage.getItem('auth_user')?.substring(0, 50) || 'Non défini'}...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}