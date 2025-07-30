import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function MyTasks() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Mes Tâches</h1>
      <Card className="p-12 text-center">
        <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Liste des tâches assignées en développement</p>
      </Card>
    </div>
  );
}