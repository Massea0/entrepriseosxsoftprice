import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Key, 
  Shield, 
  UserCheck, 
  UserX, 
  Mail, 
  Download, 
  Upload, 
  RefreshCcw,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  Users,
  Activity,
  Lock,
  Unlock,
  UserPlus,
  FileDown,
  FileUp,
  History,
  Settings,
  ShieldCheck,
  Smartphone,
  Globe,
  Calendar,
  Ban,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
  email_confirmed: boolean;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  avatar_url?: string;
  company_id?: string;
  department?: string;
  mfa_enabled?: boolean;
  password_changed_at?: string;
  failed_login_attempts?: number;
  locked_until?: string;
  groups?: string[];
  permissions?: string[];
  metadata?: Record<string, any>;
}

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_id?: string;
  target_type?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  details?: Record<string, any>;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, selectedRole, selectedStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedRole !== 'all') params.append('role', selectedRole);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  // Fetch audit logs
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await fetch('/api/admin/audit-logs');
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
    enabled: activeTab === 'audit'
  });

  // Fetch security settings
  const { data: securitySettings } = useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/security-settings');
      if (!response.ok) throw new Error('Failed to fetch security settings');
      return response.json();
    },
    enabled: activeTab === 'security'
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowCreateDialog(false);
      toast.success('Utilisateur créé avec succès');
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(null);
      toast.success('Utilisateur mis à jour');
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to reset password');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Email de réinitialisation envoyé');
    }
  });

  // Bulk actions mutation
  const bulkActionMutation = useMutation({
    mutationFn: async ({ action, userIds }: { action: string; userIds: string[] }) => {
      const response = await fetch('/api/admin/users/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds })
      });
      if (!response.ok) throw new Error('Failed to perform bulk action');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUsers([]);
      setShowBulkActions(false);
      toast.success('Action effectuée avec succès');
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((u: User) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, any> = {
      super_admin: 'destructive',
      admin: 'default',
      hr_manager: 'secondary',
      manager: 'secondary',
      employee: 'outline',
      client: 'outline'
    };
    return variants[role] || 'outline';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Console d'administration centralisée</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <FileUp className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u: User) => u.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Comptes actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Activé</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u: User) => u.mfa_enabled).length}</div>
            <p className="text-xs text-muted-foreground">Sécurité renforcée</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verrouillés</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u: User) => u.locked_until).length}</div>
            <p className="text-xs text-muted-foreground">Tentatives échouées</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="groups">Groupes</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les rôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="hr_manager">RH Manager</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                    <SelectItem value="locked">Verrouillés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span>{selectedUsers.length} utilisateur(s) sélectionné(s)</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUsers([])}
                  >
                    Annuler
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm">Actions groupées</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => bulkActionMutation.mutate({ action: 'activate', userIds: selectedUsers })}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => bulkActionMutation.mutate({ action: 'deactivate', userIds: selectedUsers })}>
                        <UserX className="mr-2 h-4 w-4" />
                        Désactiver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => bulkActionMutation.mutate({ action: 'reset-password', userIds: selectedUsers })}>
                        <Key className="mr-2 h-4 w-4" />
                        Réinitialiser MDP
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => bulkActionMutation.mutate({ action: 'delete', userIds: selectedUsers })}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>MFA</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback>
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.locked_until ? (
                              <Badge variant="destructive">
                                <Lock className="mr-1 h-3 w-3" />
                                Verrouillé
                              </Badge>
                            ) : user.is_active ? (
                              <Badge variant="success">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Actif
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <UserX className="mr-1 h-3 w-3" />
                                Inactif
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at ? (
                            <div className="text-sm">
                              {format(new Date(user.last_sign_in_at), 'dd MMM yyyy', { locale: fr })}
                              <div className="text-muted-foreground">
                                {format(new Date(user.last_sign_in_at), 'HH:mm')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Jamais</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.mfa_enabled ? (
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                          ) : (
                            <Shield className="h-5 w-5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => resetPasswordMutation.mutate(user.id)}>
                                <Key className="mr-2 h-4 w-4" />
                                Réinitialiser MDP
                              </DropdownMenuItem>
                              {user.locked_until ? (
                                <DropdownMenuItem>
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Déverrouiller
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Verrouiller
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Groupes</CardTitle>
              <CardDescription>
                Organisez les utilisateurs en groupes pour simplifier la gestion des permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Sécurité</CardTitle>
              <CardDescription>
                Configurez les politiques de sécurité globales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Authentification à deux facteurs (2FA)</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger la 2FA pour tous les utilisateurs
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Expiration du mot de passe</Label>
                    <p className="text-sm text-muted-foreground">
                      Les utilisateurs doivent changer leur mot de passe tous les 90 jours
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Verrouillage après échecs</Label>
                    <p className="text-sm text-muted-foreground">
                      Verrouiller le compte après 5 tentatives échouées
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'Audit</CardTitle>
              <CardDescription>
                Historique complet des actions administratives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {auditLogs.map((log: AuditLog) => (
                    <div key={log.id} className="flex items-start gap-4 pb-4 border-b">
                      <div className="p-2 bg-muted rounded-full">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.action}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.target_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Par utilisateur {log.user_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                          {log.ip_address && ` • IP: ${log.ip_address}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit User Dialog */}
      <Dialog open={showCreateDialog || !!editingUser} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingUser(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Modifiez les informations de l\'utilisateur' : 'Remplissez les informations pour créer un nouveau compte'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={editingUser}
            onSubmit={(data) => {
              if (editingUser) {
                updateUserMutation.mutate({ id: editingUser.id, ...data });
              } else {
                createUserMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowCreateDialog(false);
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// User Form Component
function UserForm({ user, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    role: user?.role || 'employee',
    is_active: user?.is_active ?? true,
    phone: user?.phone || '',
    department: user?.department || '',
    send_invitation: !user
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={!!user}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Département</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="hr_manager">RH Manager</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="employee">Employé</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Compte actif</Label>
        </div>

        {!user && (
          <div className="flex items-center space-x-2">
            <Switch
              id="send_invitation"
              checked={formData.send_invitation}
              onCheckedChange={(checked) => setFormData({ ...formData, send_invitation: checked })}
            />
            <Label htmlFor="send_invitation">Envoyer une invitation</Label>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {user ? 'Enregistrer' : 'Créer l\'utilisateur'}
        </Button>
      </DialogFooter>
    </form>
  );
}