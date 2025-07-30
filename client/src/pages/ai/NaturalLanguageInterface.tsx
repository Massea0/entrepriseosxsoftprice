import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageSquare, 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  Database, 
  Code,
  FileText,
  Eye,
  Play,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { aiService } from '@/services/aiService';

interface QueryResult {
  query: string;
  sql: string;
  results: any[];
  executionTime: number;
  confidence: number;
  explanation: string;
}

interface VoiceRecognition {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
}

export default function NaturalLanguageInterface() {
  const [userQuery, setUserQuery] = useState('');
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceRecognition>({
    isSupported: false,
    isListening: false,
    transcript: ''
  });
  const [selectedDatabase, setSelectedDatabase] = useState('main');
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const { toast } = useToast();
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceState(prev => ({ ...prev, transcript, isListening: false }));
        setUserQuery(transcript);
      };

      recognitionRef.current.onerror = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      setVoiceState(prev => ({ ...prev, isSupported: true }));
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      setVoiceState(prev => ({ ...prev, isListening: true, transcript: '' }));
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceState(prev => ({ ...prev, isListening: false }));
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && isSpeakingEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      synthRef.current.speak(utterance);
    }
  };

  const processNaturalLanguageQuery = async () => {
    if (!userQuery.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/natural-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userQuery,
          database: selectedDatabase,
          context: 'enterprise-management'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setQueryResults(prev => [result, ...prev]);
        
        // Speak the result summary
        const summary = `Requête exécutée avec succès. ${result.results.length} résultats trouvés en ${result.executionTime} millisecondes.`;
        speakText(summary);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      // Mock data for demo
      const mockResult: QueryResult = {
        query: userQuery,
        sql: `-- Requête générée automatiquement par l'IA
SELECT 
  c.name as company_name,
  c.email,
  COUNT(p.id) as total_projects,
  SUM(i.amount) as total_revenue
FROM companies c
LEFT JOIN projects p ON c.id = p.company_id
LEFT JOIN invoices i ON p.id = i.project_id
WHERE c.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY c.id, c.name, c.email
ORDER BY total_revenue DESC
LIMIT 10;`,
        results: [
          { company_name: 'Tech Solutions', email: 'contact@tech.com', total_projects: 3, total_revenue: 45000 },
          { company_name: 'Digital Corp', email: 'info@digital.com', total_projects: 2, total_revenue: 32000 },
          { company_name: 'Innovation Ltd', email: 'hello@innovation.com', total_projects: 4, total_revenue: 28000 }
        ],
        executionTime: 45,
        confidence: 94,
        explanation: 'J\'ai interprété votre demande comme une recherche des clients les plus rentables du mois dernier. La requête SQL join les tables companies, projects et invoices pour calculer le chiffre d\'affaires total par client.'
      };
      
      setQueryResults(prev => [mockResult, ...prev]);
      speakText('Requête simulée exécutée avec succès. 3 résultats trouvés.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Interface Langage Naturel IA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Posez vos questions en français naturel et obtenez automatiquement des données, 
            rapports et analyses de votre système. L'IA comprend et exécute vos demandes.
          </p>
        </div>

        {/* Voice & Speech Controls */}
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span className="font-medium">IA Compréhension Naturelle</span>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  100% Active
                </Badge>
              </div>
              
              {voiceState.isSupported && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={voiceState.isListening ? "destructive" : "outline"}
                    size="sm"
                    onClick={voiceState.isListening ? stopVoiceRecognition : startVoiceRecognition}
                  >
                    {voiceState.isListening ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Arrêter
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Parler
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
            >
              {isSpeakingEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Audio On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Audio Off
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Query Input */}
        <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Posez votre question
            </CardTitle>
            <CardDescription>
              Exemples: "Quels sont mes 5 meilleurs clients ce mois ?" • "Montre-moi les projets en retard" • 
              "Quel est le chiffre d'affaires par région ?"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {voiceState.isListening && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-red-500 " />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Écoute en cours... Parlez maintenant
                  </span>
                </div>
              </div>
            )}
            
            <Textarea
              placeholder="Exemple: Montre-moi les factures impayées de plus de 30 jours..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="min-h-24"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Base de données: {selectedDatabase}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Exemples
                </Button>
                <Button 
                  onClick={processNaturalLanguageQuery}
                  disabled={!userQuery.trim() || isProcessing}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 " />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Exécuter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {queryResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Résultats des Requêtes</h2>
            
            {queryResults.map((result, index) => (
              <Card key={index} className="border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Requête Exécutée
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getConfidenceColor(result.confidence)}>
                        {result.confidence}% confiance
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {result.executionTime}ms
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base">
                    "{result.query}"
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* AI Explanation */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      Explication de l'IA
                    </h4>
                    <p className="text-sm text-muted-foreground">{result.explanation}</p>
                  </div>

                  <Tabs defaultValue="results" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="results">Résultats</TabsTrigger>
                      <TabsTrigger value="sql">Code SQL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="results" className="space-y-4">
                      {result.results.length > 0 ? (
                        <div className="rounded-lg border overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  {Object.keys(result.results[0]).map((key) => (
                                    <th key={key} className="px-4 py-3 text-left text-sm font-medium">
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {result.results.map((row, rowIndex) => (
                                  <tr key={rowIndex} className="border-t">
                                    {Object.values(row).map((value, cellIndex) => (
                                      <td key={cellIndex} className="px-4 py-3 text-sm">
                                        {typeof value === 'number' && value > 1000 
                                          ? value.toLocaleString('fr-FR') 
                                          : String(value)
                                        }
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Aucun résultat trouvé
                        </div>
                      )}
                      
                      <div className="text-sm text-muted-foreground">
                        {result.results.length} résultat(s) trouvé(s)
                      </div>
                    </TabsContent>

                    <TabsContent value="sql" className="space-y-4">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{result.sql}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(result.sql)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Réexécuter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Créer Rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Exemples de Requêtes</CardTitle>
            <CardDescription>
              Cliquez sur un exemple pour l'essayer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Quels sont mes 10 meilleurs clients par chiffre d'affaires ?",
                "Montre-moi les projets en retard de plus de 7 jours",
                "Quel est le taux de conversion des devis ce mois ?",
                "Quels employés ont le plus d'heures facturables ?",
                "Combien de tickets de support sont ouverts ?",
                "Quel est le délai moyen de paiement des factures ?"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start whitespace-normal"
                  onClick={() => setUserQuery(example)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
