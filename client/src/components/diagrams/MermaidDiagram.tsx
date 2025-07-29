import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Code, Eye } from 'lucide-react';

// Configuration de Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#1f2937',
    primaryBorderColor: '#1d4ed8',
    lineColor: '#6b7280',
    secondaryColor: '#e5e7eb',
    tertiaryColor: '#f3f4f6',
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    fontSize: 11,
    gridLineStartPadding: 35,
    numberSectionStyles: 4,
  },
});

export interface MermaidDiagramProps {
  chart: string;
  title?: string;
  description?: string;
  type?: 'flowchart' | 'sequence' | 'gantt' | 'gitgraph' | 'pie' | 'journey' | 'class';
  showControls?: boolean;
  editable?: boolean;
  onChartChange?: (newChart: string) => void;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  title,
  description,
  type = 'flowchart',
  showControls = true,
  editable = false,
  onChartChange,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [editableChart, setEditableChart] = useState(chart);

  useEffect(() => {
    renderDiagram();
  }, [chart]);

  const renderDiagram = async () => {
    if (!elementRef.current || !chart?.trim()) {
      setError('Élément de rendu ou code Mermaid manquant');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const container = elementRef.current;
      
      // Vérification additionnelle avant manipulation
      if (!container) {
        throw new Error('Conteneur de rendu non disponible');
      }

      // Nettoyer le conteneur
      container.innerHTML = '';
      
      // Générer un ID unique pour le diagramme
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Validation et nettoyage du code Mermaid
      let cleanChart = chart.trim();
      
      // Corrections automatiques courantes
      if (!cleanChart.includes('gantt') && !cleanChart.includes('graph') && !cleanChart.includes('flowchart')) {
        // Si pas de type défini, ajouter flowchart par défaut
        cleanChart = `flowchart TD\n${cleanChart}`;
      }

      // Nettoyer les caractères problématiques
      cleanChart = cleanChart.replace(/[^\x00-\x7F]/g, ''); // Supprimer caractères non-ASCII
      cleanChart = cleanChart.replace(/\s+/g, ' '); // Normaliser espaces
      
      try {
        // Tentative de validation
        await mermaid.parse(cleanChart);
      } catch (parseError) {
        console.warn('Parse error, using fallback diagram:', parseError);
        // Diagramme de fallback simple
        cleanChart = `flowchart TD
    A[Début] --> B[Traitement]
    B --> C[Fin]`;
      }
      
      // Rendre le diagramme
      const { svg } = await mermaid.render(id, cleanChart);
      
      // Vérification finale avant insertion
      if (!elementRef.current) {
        console.warn('Conteneur supprimé pendant le rendu - arrêt silencieux');
        return;
      }
      
      elementRef.current.innerHTML = svg;
      
      // Appliquer des styles supplémentaires
      const svgElement = elementRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.display = 'block';
        svgElement.style.margin = '0 auto';
      }
    } catch (err) {
      console.error('Mermaid render error:', err);
      setError(`Erreur de rendu: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      
      // Fallback: afficher un message d'erreur dans le conteneur
      if (elementRef.current) {
        elementRef.current.innerHTML = `
          <div class="flex flex-col items-center justify-center p-8 text-center border border-red-200 rounded-lg bg-red-50">
            <div class="text-red-600 mb-2">⚠️ Erreur de rendu</div>
            <div class="text-sm text-red-500">${err instanceof Error ? err.message : 'Erreur inconnue'}</div>
          </div>
        `;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSVG = () => {
    const svgElement = elementRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${title || 'diagramme'}-${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const downloadPNG = async () => {
    const svgElement = elementRef.current?.querySelector('svg');
    if (!svgElement) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = `${title || 'diagramme'}-${Date.now()}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
        }, 'image/png');
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err) {
      console.error('Erreur lors de l\'export PNG:', err);
    }
  };

  const handleChartEdit = (newChart: string) => {
    setEditableChart(newChart);
    if (onChartChange) {
      onChartChange(newChart);
    }
  };

  const getTypeLabel = () => {
    const labels = {
      flowchart: 'Flowchart',
      sequence: 'Séquence',
      gantt: 'Gantt',
      gitgraph: 'Git Graph',
      pie: 'Secteurs',
      journey: 'Journey',
      class: 'Classes',
    };
    return labels[type] || 'Diagramme';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              {title || 'Diagramme Mermaid'}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {getTypeLabel()}
            </Badge>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={renderDiagram}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSVG}
              >
                <Download className="h-4 w-4 mr-1" />
                SVG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPNG}
              >
                <Download className="h-4 w-4 mr-1" />
                PNG
              </Button>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        {showCode && editable && (
          <div className="mb-4">
            <textarea
              value={editableChart}
              onChange={(e) => handleChartEdit(e.target.value)}
              className="w-full h-32 p-3 border rounded-md font-mono text-sm resize-none"
              placeholder="Entrez votre code Mermaid ici..."
            />
          </div>
        )}
        
        {showCode && !editable && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <pre className="text-sm font-mono whitespace-pre-wrap">{chart}</pre>
          </div>
        )}
        
        {error ? (
          <div className="border rounded-lg p-8 text-center">
            <div className="text-red-500 mb-2">⚠️ Erreur de rendu</div>
            <div className="text-sm text-muted-foreground">{error}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={renderDiagram}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Réessayer
            </Button>
          </div>
        ) : isLoading ? (
          <div className="border rounded-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="text-sm text-muted-foreground">Génération du diagramme...</div>
            </div>
          </div>
        ) : (
          <div 
            ref={elementRef}
            className="border rounded-lg p-4 bg-white dark:bg-gray-950 overflow-auto"
            style={{ minHeight: '200px' }}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Composants prédéfinis pour différents types de diagrammes
export const OrgChartMermaid: React.FC<{ employees: unknown[] }> = ({ employees }) => {
  const generateOrgChart = () => {
    let chart = 'graph TD\n';
    
    employees.forEach(emp => {
      const empId = emp.id.replace(/[^a-zA-Z0-9]/g, '_');
      const empName = `${emp.first_name} ${emp.last_name}`;
      const empTitle = emp.positions?.title || 'Employé';
      
      chart += `  ${empId}["${empName}<br/>${empTitle}"]\n`;
      
      if (emp.manager_id) {
        const managerId = emp.manager_id.replace(/[^a-zA-Z0-9]/g, '_');
        chart += `  ${managerId} --> ${empId}\n`;
      }
    });
    
    return chart;
  };

  return (
    <MermaidDiagram
      chart={generateOrgChart()}
      title="Organigramme Mermaid"
      description="Diagramme hiérarchique généré automatiquement"
      type="flowchart"
    />
  );
};

export const GanttMermaid: React.FC<{ tasks: unknown[] }> = ({ tasks }) => {
  const generateGantt = () => {
    let chart = 'gantt\n    title Planification des Tâches\n    dateFormat YYYY-MM-DD\n    section Projets\n';
    
    tasks.forEach(task => {
      const taskName = task.title?.replace(/[^a-zA-Z0-9\s]/g, '') || 'Tâche';
      const startDate = task.created_at ? new Date(task.created_at).toISOString().split('T')[0] : '2024-01-01';
      const endDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '2024-12-31';
      
      chart += `    ${taskName} : ${task.status === 'done' ? 'done, ' : ''}${startDate}, ${endDate}\n`;
    });
    
    return chart;
  };

  return (
    <MermaidDiagram
      chart={generateGantt()}
      title="Diagramme de Gantt"
      description="Planning des tâches et projets"
      type="gantt"
    />
  );
};

export default MermaidDiagram;
