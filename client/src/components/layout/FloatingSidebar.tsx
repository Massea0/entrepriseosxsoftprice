import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Settings,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  BarChart3,
  Calendar,
  MessageSquare,
  Bell,
  Search,
  Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { CommandPalette } from '@/components/ui/CommandPalette';

interface NavItem {
  title: string;
  path: string;
  icon: any;
  roles?: string[];
  badge?: string | number;
  gradient?: string;
  description?: string;
  isNew?: boolean;
  subItems?: NavItem[];
}

// Navigation structure for different roles
const getNavigationItems = (userRole: string): NavItem[] => {
  const adminItems: NavItem[] = [
    { 
      title: 'Configuration', 
      path: '/admin/config', 
      icon: Settings, 
      gradient: 'from-purple-500 to-violet-600',
      description: 'Système & paramètres'
    },
    { 
      title: 'Vue Globale', 
      path: '/admin/dashboard', 
      icon: BarChart3, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Métriques entreprise'
    },
    { 
      title: 'Synapse IA', 
      path: '/synapse', 
      icon: Sparkles, 
      gradient: 'from-pink-500 to-rose-500',
      description: 'Assistant vocal IA',
      isNew: true
    }
  ];

  const managerItems: NavItem[] = [
    { 
      title: 'Dashboard', 
      path: '/manager/dashboard', 
      icon: LayoutDashboard, 
      gradient: 'from-indigo-500 to-blue-600' 
    },
    { 
      title: 'Équipe', 
      path: '/manager/team', 
      icon: Users, 
      gradient: 'from-green-500 to-emerald-600',
      badge: '8'
    },
    { 
      title: 'Validations', 
      path: '/manager/approvals', 
      icon: CheckSquare, 
      gradient: 'from-orange-500 to-amber-600',
      badge: '3'
    },
    { 
      title: 'Performance', 
      path: '/manager/performance', 
      icon: BarChart3, 
      gradient: 'from-purple-500 to-pink-600' 
    },
    { 
      title: 'Planning', 
      path: '/manager/schedule', 
      icon: Calendar, 
      gradient: 'from-cyan-500 to-teal-600' 
    },
    { 
      title: 'Rapports', 
      path: '/manager/reports', 
      icon: FolderOpen, 
      gradient: 'from-rose-500 to-red-600' 
    }
  ];

  const employeeItems: NavItem[] = [
    { 
      title: 'Dashboard', 
      path: '/employee/dashboard', 
      icon: LayoutDashboard, 
      gradient: 'from-blue-500 to-cyan-600' 
    },
    { 
      title: 'Profil', 
      path: '/employee/profile', 
      icon: Users, 
      gradient: 'from-green-500 to-teal-600' 
    },
    { 
      title: 'Congés', 
      path: '/employee/leave', 
      icon: Calendar, 
      gradient: 'from-purple-500 to-indigo-600' 
    },
    { 
      title: 'Temps', 
      path: '/employee/time', 
      icon: CheckSquare, 
      gradient: 'from-orange-500 to-red-600' 
    },
    { 
      title: 'Formation', 
      path: '/employee/training', 
      icon: Sparkles, 
      gradient: 'from-pink-500 to-rose-600',
      isNew: true
    },
    { 
      title: 'Communication', 
      path: '/employee/communication', 
      icon: MessageSquare, 
      gradient: 'from-cyan-500 to-blue-600' 
    }
  ];

  const clientItems: NavItem[] = [
    { 
      title: 'Dashboard', 
      path: '/client/dashboard', 
      icon: LayoutDashboard, 
      gradient: 'from-orange-500 to-red-600' 
    },
    { 
      title: 'Projets', 
      path: '/client/projects', 
      icon: FolderOpen, 
      gradient: 'from-blue-500 to-indigo-600' 
    },
    { 
      title: 'Factures', 
      path: '/client/invoices', 
      icon: CheckSquare, 
      gradient: 'from-green-500 to-emerald-600' 
    }
  ];

  switch (userRole) {
    case 'admin':
    case 'super_admin':
      return adminItems;
    case 'manager':
      return managerItems;
    case 'employee':
      return employeeItems;
    case 'client':
      return clientItems;
    default:
      return [];
  }
};

export default function FloatingSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const navigationItems = getNavigationItems(user?.role || '');

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      width: 80,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.95
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }),
    hover: {
      x: 8,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  return (
    <>
      <motion.div
        className={cn(
          "fixed left-4 top-4 bottom-4 z-50",
          "glass-effect-dark rounded-2xl",
          "flex flex-col overflow-hidden",
          "border border-white/10 shadow-2xl"
        )}
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        style={{
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2, delay: collapsed ? 0 : 0.1 }}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Arcadis OS</h2>
                <p className="text-xs text-white/60 capitalize">{user?.role}</p>
              </div>
            </motion.div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>

          {/* Command Palette Trigger */}
          <motion.button
            className="w-full mt-4 p-3 rounded-lg bg-white/5 border border-white/10 text-left text-white/60 text-sm hover:bg-white/10 transition-colors"
            onClick={() => setShowCommandPalette(true)}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2, delay: collapsed ? 0 : 0.1 }}
          >
            <div className="flex items-center justify-between">
              <span>Recherche...</span>
              <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white/60">
                ⌘K
              </Badge>
            </div>
          </motion.button>
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;

            return (
              <motion.div
                key={item.path}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link to={item.path} className="block">
                  <div
                    className={cn(
                      "relative group rounded-xl transition-all duration-300 overflow-hidden",
                      "hover:shadow-lg hover:shadow-purple-500/20",
                      isActive 
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30" 
                        : "hover:bg-white/5"
                    )}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center p-3 relative">
                      <div className={cn(
                        "relative p-2 rounded-lg transition-all duration-300",
                        item.gradient ? `bg-gradient-to-br ${item.gradient}` : "bg-white/10",
                        hoveredItem === item.path && "scale-110 shadow-lg"
                      )}>
                        <Icon className="h-4 w-4 text-white" />
                        {item.isNew && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>

                      <motion.div
                        className="ml-3 flex-1"
                        animate={{ opacity: collapsed ? 0 : 1 }}
                        transition={{ duration: 0.2, delay: collapsed ? 0 : 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge className="h-5 px-2 text-xs bg-red-500/80 text-white border-none">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-white/50 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        x: hoveredItem === item.path ? ['0%', '100%'] : '0%'
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <Separator className="bg-white/10" />

        {/* User Profile & Actions */}
        <div className="p-3">
          <motion.div
            className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2, delay: collapsed ? 0 : 0.1 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {user?.firstName || user?.email}
              </p>
              <p className="text-xs text-white/50">En ligne</p>
            </div>
          </motion.div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full mt-2 text-white/60 hover:text-white hover:bg-red-500/10 transition-colors"
          >
            <motion.span
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2, delay: collapsed ? 0 : 0.1 }}
            >
              Déconnexion
            </motion.span>
          </Button>
        </div>
      </motion.div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette open={showCommandPalette} setOpen={setShowCommandPalette} />
    </>
  );
}