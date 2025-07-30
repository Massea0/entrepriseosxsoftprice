import { Card } from '@/components/ui/card';
import { FileCheck } from 'lucide-react';

export default function ProjectForm() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Nouveau Projet</h1>
      <Card className="p-12 text-center">
        <FileCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Formulaire de création en développement</p>
      </Card>
    </div>
  );
}