import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function ProjectsTimeline() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Timeline des Projets</h1>
      <Card className="p-12 text-center">
        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Vue Gantt en développement</p>
      </Card>
    </div>
  );
}