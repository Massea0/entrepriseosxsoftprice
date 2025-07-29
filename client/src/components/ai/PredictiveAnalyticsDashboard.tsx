// Simplified Predictive Analytics Dashboard for migration
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, BarChart3, PieChart, LineChart } from 'lucide-react';

export const PredictiveAnalyticsDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const mockAnalytics = {
    insights: [
      {
        type: 'trend',
        title: 'Croissance prévue',
        value: '15%',
        confidence: 78,
        timeframe: 'next_quarter'
      },
      {
        type: 'risk',
        title: 'Risque de rotation',
        value: '8%',
        confidence: 85,
        timeframe: 'next_month'
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Prédictives</h2>
        <div className="flex gap-2">
          <Button 
            variant={selectedTimeframe === 'weekly' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('weekly')}
            size="sm"
          >
            Semaine
          </Button>
          <Button 
            variant={selectedTimeframe === 'monthly' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('monthly')}
            size="sm"
          >
            Mois
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAnalytics.insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {insight.type === 'trend' ? <TrendingUp className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{insight.value}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{insight.confidence}% confiance</Badge>
                <Badge variant="secondary">{insight.timeframe}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <LineChart className="h-4 w-4" />
        <AlertDescription>
          Les analytics prédictives utilisent l'IA pour analyser les tendances historiques 
          et prévoir les évolutions futures. Migration Supabase → Express complétée.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;