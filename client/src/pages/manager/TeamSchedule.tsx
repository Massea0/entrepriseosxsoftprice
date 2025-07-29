import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'leave' | 'training' | 'project';
  startTime: string;
  endTime: string;
  date: string;
  participants: string[];
  location?: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'away' | 'vacation';
}

const TeamSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: scheduleEvents = [] } = useQuery({
    queryKey: ['/api/manager/schedule', selectedDate.toISOString().split('T')[0]],
    initialData: [
      {
        id: '1',
        title: 'Réunion équipe hebdomadaire',
        type: 'meeting' as const,
        startTime: '09:00',
        endTime: '10:00',
        date: '2025-01-22',
        participants: ['Aminata Diallo', 'Omar Ndiaye', 'Fatou Sow'],
        location: 'Salle de conférence A',
        description: 'Point hebdomadaire sur les projets en cours',
        priority: 'medium' as const
      },
      {
        id: '2',
        title: 'Formation React Native',
        type: 'training' as const,
        startTime: '14:00',
        endTime: '17:00',
        date: '2025-01-22',
        participants: ['Aminata Diallo'],
        location: 'Salle formation',
        description: 'Session de formation sur React Native',
        priority: 'high' as const
      },
      {
        id: '3',
        title: 'Deadline projet client X',
        type: 'deadline' as const,
        startTime: '17:00',
        endTime: '17:00',
        date: '2025-01-24',
        participants: ['Omar Ndiaye', 'Aminata Diallo'],
        description: 'Livraison finale du projet client X',
        priority: 'high' as const
      },
      {
        id: '4',
        title: 'Congé - Fatou Sow',
        type: 'leave' as const,
        startTime: '00:00',
        endTime: '23:59',
        date: '2025-01-23',
        participants: ['Fatou Sow'],
        description: 'Congé personnel',
        priority: 'low' as const
      }
    ] as ScheduleEvent[]
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['/api/manager/team/status'],
    initialData: [
      { id: '1', name: 'Aminata Diallo', role: 'Dev Frontend', status: 'available' as const },
      { id: '2', name: 'Omar Ndiaye', role: 'Designer UX', status: 'busy' as const },
      { id: '3', name: 'Fatou Sow', role: 'Chef Projet', status: 'vacation' as const },
      { id: '4', name: 'Moussa Kane', role: 'Dev Backend', status: 'available' as const }
    ] as TeamMember[]
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200';
      case 'leave': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'training': return 'bg-green-100 text-green-800 border-green-200';
      case 'project': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'Réunion';
      case 'deadline': return 'Échéance';
      case 'leave': return 'Congé';
      case 'training': return 'Formation';
      case 'project': return 'Projet';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'away': return 'bg-gray-100 text-gray-800';
      case 'vacation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Occupé';
      case 'away': return 'Absent';
      case 'vacation': return 'En congé';
      default: return status;
    }
  };

  const filteredEvents = scheduleEvents.filter(event => {
    if (selectedFilter === 'all') return true;
    return event.type === selectedFilter;
  });

  const todayEvents = filteredEvents.filter(event => 
    event.date === new Date().toISOString().split('T')[0]
  );

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.date) > new Date() && 
    new Date(event.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Planning d'Équipe</h1>
          <p className="text-muted-foreground">Gérez les horaires et disponibilités de votre équipe</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout afficher</SelectItem>
              <SelectItem value="meeting">Réunions</SelectItem>
              <SelectItem value="deadline">Échéances</SelectItem>
              <SelectItem value="leave">Congés</SelectItem>
              <SelectItem value="training">Formations</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Événement
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Jour
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Semaine
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Mois
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium px-4">
            {selectedDate.toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long',
              ...(viewMode === 'day' && { day: 'numeric' })
            })}
          </span>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Team Status */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Calendrier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Statut Équipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(member.status)} variant="secondary">
                    {getStatusLabel(member.status)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Events Lists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Aujourd'hui ({todayEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun événement aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge className={getEventTypeColor(event.type)} variant="outline">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {event.participants.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {event.participants.map((participant, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Prochains 7 jours ({upcomingEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun événement à venir</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{event.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getEventTypeColor(event.type)} variant="outline">
                            {getEventTypeLabel(event.type)}
                          </Badge>
                          {event.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {event.participants.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {event.participants.map((participant, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamSchedule;