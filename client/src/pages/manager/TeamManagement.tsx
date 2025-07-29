import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  TrendingUp, 
  UserPlus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'absent' | 'vacation';
  performanceScore: number;
  tasksAssigned: number;
  tasksCompleted: number;
  avatar?: string;
}

const TeamManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data for team members
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['/api/manager/team'],
    initialData: [
      {
        id: '1',
        firstName: 'Aminata',
        lastName: 'Diallo',
        email: 'aminata.diallo@arcadis.tech',
        role: 'Développeuse Frontend',
        department: 'Développement',
        status: 'active' as const,
        performanceScore: 94,
        tasksAssigned: 12,
        tasksCompleted: 10,
      },
      {
        id: '2',
        firstName: 'Omar',
        lastName: 'Ndiaye',
        email: 'omar.ndiaye@arcadis.tech',
        role: 'Designer UX/UI',
        department: 'Design',
        status: 'active' as const,
        performanceScore: 87,
        tasksAssigned: 8,
        tasksCompleted: 8,
      },
      {
        id: '3',
        firstName: 'Fatou',
        lastName: 'Sow',
        email: 'fatou.sow@arcadis.tech',
        role: 'Chef de Projet',
        department: 'Management',
        status: 'vacation' as const,
        performanceScore: 91,
        tasksAssigned: 15,
        tasksCompleted: 13,
      },
    ] as TeamMember[]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'vacation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'absent': return 'Absent';
      case 'vacation': return 'En congé';
      default: return 'Inconnue';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = ['all', ...Array.from(new Set(teamMembers.map(member => member.department)))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion d'Équipe</h1>
          <p className="text-muted-foreground">Gérez votre équipe et suivez leurs performances</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un Membre
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Équipe</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Performance Moy.</p>
                <p className="text-2xl font-bold">
                  {Math.round(teamMembers.reduce((acc, member) => acc + member.performanceScore, 0) / teamMembers.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tâches Actives</p>
                <p className="text-2xl font-bold">
                  {teamMembers.reduce((acc, member) => acc + member.tasksAssigned, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Présents Aujourd'hui</p>
                <p className="text-2xl font-bold">
                  {teamMembers.filter(member => member.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un membre de l'équipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md"
        >
          <option value="all">Tous les départements</option>
          {departments.slice(1).map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Team Members */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Vue Grille</TabsTrigger>
          <TabsTrigger value="list">Vue Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Voir Profil</DropdownMenuItem>
                        <DropdownMenuItem>Assigner Tâche</DropdownMenuItem>
                        <DropdownMenuItem>Contacter</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <Badge className={getStatusColor(member.status)}>
                      {getStatusText(member.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <span className="font-semibold text-green-600">{member.performanceScore}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tâches</span>
                    <span className="font-semibold">
                      {member.tasksCompleted}/{member.tasksAssigned}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Membre</th>
                      <th className="p-4 font-medium">Rôle</th>
                      <th className="p-4 font-medium">Département</th>
                      <th className="p-4 font-medium">Statut</th>
                      <th className="p-4 font-medium">Performance</th>
                      <th className="p-4 font-medium">Tâches</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.firstName[0]}{member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.firstName} {member.lastName}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{member.role}</td>
                        <td className="p-4">{member.department}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(member.status)}>
                            {getStatusText(member.status)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-green-600">{member.performanceScore}%</span>
                        </td>
                        <td className="p-4">
                          {member.tasksCompleted}/{member.tasksAssigned}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Voir Profil</DropdownMenuItem>
                              <DropdownMenuItem>Assigner Tâche</DropdownMenuItem>
                              <DropdownMenuItem>Contacter</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;