import React from 'react';
import ThirdPartyIntegrations from '@/components/integrations/ThirdPartyIntegrations';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';

export default function IntegrationsAdmin() {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <Network className="h-8 w-8 text-primary" />
          <span>Intégrations Tierces</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Configuration et gestion des intégrations externes (Slack, Teams, WhatsApp)
        </p>
      </div>

      <ThirdPartyIntegrations />
    </div>
  );
} 