import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban } from 'lucide-react';

export default function ProjectsKanban() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vue Kanban</h1>
        <p className="text-muted-foreground">
          Gérez vos projets avec une vue kanban interactive
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Kanban en développement
          </CardTitle>
          <CardDescription>
            Le drag & drop sera bientôt disponible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Vue Kanban avec colonnes personnalisables et drag & drop.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}