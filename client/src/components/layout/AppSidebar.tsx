
import { 
  Building2, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Home,
  Mic,
  Shield,
  Workflow,
  ScrollText,
  User,
  Calendar,
  Clock,
  Briefcase,
  Heart,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Activity,
  UserCheck,
  Receipt,
  Sparkles,
  Link,
  FileCheck,
  Calculator,
  CreditCard,
  Brain,
  Zap,
  FolderKanban
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const getMenuItemsByRole = (userRole: string) => {
  const baseItems = [
    {
      title: "🧠 Synapse Live",
      url: "/synapse",
      icon: Mic,
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
          icon: Shield,
          roles: ['admin', 'super_admin'],
        },
        {
          title: "⚡ Phase 2 Demo",
          url: "/admin/enhanced",
          icon: Sparkles,
          roles: ['admin', 'super_admin'],
        },
        ...baseItems,
        {
          title: "🏗️ Projets",
          icon: FolderKanban,
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Liste des Projets", url: "/projects", icon: Building2 },
            { title: "Vue Kanban", url: "/projects/kanban", icon: FolderKanban },
            { title: "Timeline", url: "/projects/timeline", icon: BarChart3 },
            { title: "Créer un Projet", url: "/projects/new", icon: FileCheck },
          ]
        },
        {
          title: "💼 Business",
          icon: DollarSign,
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Factures", url: "/invoices", icon: Receipt },
            { title: "Devis", url: "/quotes", icon: FileText },
            { title: "Contrats", url: "/contracts", icon: ScrollText },
            { title: "Paiements", url: "/payments", icon: CreditCard },
            { title: "Rapports Financiers", url: "/financial-reports", icon: Calculator },
          ]
        },
        {
          title: "🤖 Intelligence Artificielle",
          icon: Brain,
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "AI Insights", url: "/ai/insights", icon: Brain },
            { title: "Prédictions", url: "/ai/predictions", icon: TrendingUp },
            { title: "Assignation Auto", url: "/ai/auto-assign", icon: Zap },
            { title: "Natural Voice", url: "/ai/voice", icon: Mic },
          ]
        },
        {
          title: "Configuration Système",
          url: "/admin/config",
          icon: Settings,
          roles: ['admin', 'super_admin'],
        },
        {
          title: "🛡️ Administration",
          icon: Shield,
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Vue Globale", url: "/admin/overview", icon: BarChart3 },
            { title: "Workflows", url: "/admin/workflows", icon: Workflow },
            { title: "Support", url: "/admin/support", icon: MessageSquare },
            { title: "Sécurité", url: "/admin/security", icon: Shield },
          ]
        },
        {
          title: "Vue Entreprise",
          icon: Building2,
          roles: ['admin', 'super_admin'],
          submenu: [
            { title: "Analytics Globaux", url: "/admin/analytics", icon: BarChart3 },
            { title: "Métriques RH", url: "/admin/hr-metrics", icon: Users },
            { title: "Performance", url: "/admin/performance", icon: TrendingUp },
            { title: "Intégrations", url: "/admin/integrations", icon: Link },
            { title: "Quantum OS", url: "/admin/quantum", icon: Sparkles },
          ]
        }
      ];

    case 'manager':
      return [
        {
          title: "Dashboard Manager",
          url: "/manager/dashboard",
          icon: BarChart3,
          roles: ['manager'],
        },
        ...baseItems,
        {
          title: "🏗️ Projets",
          icon: FolderKanban,
          roles: ['manager'],
          submenu: [
            { title: "Mes Projets", url: "/projects", icon: Building2 },
            { title: "Vue Kanban", url: "/projects/kanban", icon: FolderKanban },
            { title: "Timeline", url: "/projects/timeline", icon: BarChart3 },
            { title: "Créer un Projet", url: "/projects/new", icon: FileCheck },
          ]
        },
        {
          title: "💼 Business",
          icon: DollarSign,
          roles: ['manager'],
          submenu: [
            { title: "Factures", url: "/invoices", icon: Receipt },
            { title: "Devis", url: "/quotes", icon: FileText },
            { title: "Suivi Paiements", url: "/payments", icon: CreditCard },
          ]
        },
        {
          title: "Gestion d'Équipe",
          icon: Users,
          roles: ['manager'],
          submenu: [
            { title: "Mon Équipe", url: "/manager/team", icon: Users },
            { title: "Assignations", url: "/manager/assignments", icon: Briefcase },
            { title: "Validations", url: "/manager/approvals", icon: CheckCircle },
            { title: "Performance", url: "/manager/performance", icon: TrendingUp },
            { title: "Planning", url: "/manager/schedule", icon: Calendar },
          ]
        },
        {
          title: "Rapports",
          icon: FileText,
          roles: ['manager'],
          submenu: [
            { title: "Tableau de Bord", url: "/manager/reports", icon: BarChart3 },
            { title: "Productivité", url: "/manager/reports/productivity", icon: Activity },
            { title: "Présence", url: "/manager/reports/attendance", icon: UserCheck },
          ]
        }
      ];

    case 'client':
      return [
        {
          title: "Dashboard Client",
          url: "/client/dashboard",
          icon: Home,
          roles: ['client'],
        },
        ...baseItems,
        {
          title: "Mes Projets",
          url: "/client/projects",
          icon: Building2,
          roles: ['client'],
        },
        {
          title: "💼 Documents",
          icon: FileText,
          roles: ['client'],
          submenu: [
            { title: "Mes Factures", url: "/client/invoices", icon: Receipt },
            { title: "Mes Devis", url: "/client/quotes", icon: FileText },
            { title: "Mes Contrats", url: "/client/contracts", icon: ScrollText },
          ]
        },
        {
          title: "Paiements",
          url: "/client/payments",
          icon: CreditCard,
          roles: ['client'],
        }
      ];

    case 'employee':
      return [
        {
          title: "Dashboard Employé",
          url: "/employee/dashboard",
          icon: Home,
          roles: ['employee'],
        },
        ...baseItems,
        {
          title: "🏗️ Mes Projets",
          icon: FolderKanban,
          roles: ['employee'],
          submenu: [
            { title: "Projets Assignés", url: "/projects", icon: Building2 },
            { title: "Mes Tâches", url: "/projects/my-tasks", icon: CheckCircle },
            { title: "Vue Kanban", url: "/projects/kanban", icon: FolderKanban },
          ]
        },
        {
          title: "Ressources Humaines",
          icon: Users,
          roles: ['employee'],
          submenu: [
            { title: "Mon Profil", url: "/employee/profile", icon: User },
            { title: "Mes Congés", url: "/employee/leave", icon: Calendar },
            { title: "Demande de Congés", url: "/employee/leave-request", icon: Calendar },
            { title: "Suivi du Temps", url: "/employee/time", icon: Clock },
            { title: "Arrêts Maladie", url: "/employee/sick-leave", icon: Heart },
            { title: "Performance", url: "/employee/performance", icon: TrendingUp },
            { title: "Paie & Avantages", url: "/employee/payroll", icon: DollarSign },
          ]
        },
        {
          title: "Mes Assignations",
          url: "/employee/assignments",
          icon: Briefcase,
          roles: ['employee'],
        }
      ];

    default:
      return baseItems;
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  
  const currentPath = location.pathname;
  const userRole = user?.role || 'client';
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClass = (isActive: boolean) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "";

  // Get menu items based on user role
  const menuItems = getMenuItemsByRole(userRole);
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  // Debug: Afficher les informations de debug
  console.log('AppSidebar Debug:');
  console.log('  - User Role:', userRole);
  console.log('  - Menu Items:', menuItems);
  console.log('  - Filtered Menu Items:', filteredMenuItems);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/arcadis-logo.svg" 
            alt="Arcadis Technologies" 
            className="h-8 w-8" 
          />
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">Arcadis Entreprise OS</p>
              <p className="text-xs text-muted-foreground">by Arcadis Technologies</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {filteredMenuItems.map((item) => (
          <SidebarGroup key={item.title}>
            {item.submenu ? (
              <>
                <SidebarGroupLabel className="text-xs text-muted-foreground">
                  {item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.submenu.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={subItem.url} 
                            className={getNavClass(isActive(subItem.url))}
                          >
                            <subItem.icon className="h-4 w-4" />
                            {!collapsed && <span>{subItem.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClass(isActive(item.url))}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/settings" 
                    className={getNavClass(isActive('/settings'))}
                  >
                    <Settings className="h-4 w-4" />
                    {!collapsed && <span>Paramètres</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!collapsed && user && (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">{user.email}</p>
            <p className="capitalize">{userRole}</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
