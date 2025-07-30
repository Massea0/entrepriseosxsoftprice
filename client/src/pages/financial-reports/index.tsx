import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, FileText, Download, Calendar } from 'lucide-react';

export default function FinancialReports() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rapports Financiers</h1>
        <p className="text-muted-foreground">
          Analyses détaillées et rapports comptables
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bilan Mensuel
            </CardTitle>
            <CardDescription>
              Vue d'ensemble des finances du mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Générer le rapport
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Compte de Résultat
            </CardTitle>
            <CardDescription>
              Analyse des revenus et dépenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Générer le rapport
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Prévisionnel
            </CardTitle>
            <CardDescription>
              Projections sur 6 mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Générer le rapport
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module en développement</CardTitle>
          <CardDescription>
            Les rapports financiers avancés seront bientôt disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Génération automatique de rapports, export Sage, analyses prédictives.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}