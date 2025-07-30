import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
  Bot,
  Brain,
  Target,
  Star,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ExtractedData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
  };
  skills: Array<{
    name: string;
    level: number; // 1-5
    category: string;
    yearsExperience: number;
  }>;
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
    skills: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  aiAnalysis: {
    profileSummary: string;
    strengthAreas: string[];
    improvementAreas: string[];
    careerTrajectory: string;
    matchScore: number;
    recommendations: string[];
  };
}

const CVParser: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState('');

  const processingSteps = [
    { step: 'upload', label: 'Téléchargement du fichier', icon: Upload },
    { step: 'ocr', label: 'Extraction du texte (OCR)', icon: FileText },
    { step: 'nlp', label: 'Analyse NLP des données', icon: Brain },
    { step: 'skills', label: 'Identification des compétences', icon: Target },
    { step: 'ai', label: 'Analyse IA approfondie', icon: Bot },
    { step: 'complete', label: 'Traitement terminé', icon: Check }
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);
    setError('');
    setProcessingProgress(0);

    try {
      // Simulation du processus d'extraction
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(processingSteps[i].step);
        setProcessingProgress((i + 1) * (100 / processingSteps.length));
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Données simulées extraites
      const mockExtractedData: ExtractedData = {
        personalInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          address: 'Paris, France',
          linkedin: 'linkedin.com/in/jeandupont',
          github: 'github.com/jdupont'
        },
        skills: [
          { name: 'React', level: 5, category: 'Frontend', yearsExperience: 5 },
          { name: 'TypeScript', level: 4, category: 'Language', yearsExperience: 3 },
          { name: 'Node.js', level: 4, category: 'Backend', yearsExperience: 4 },
          { name: 'AWS', level: 3, category: 'Cloud', yearsExperience: 2 },
          { name: 'Docker', level: 3, category: 'DevOps', yearsExperience: 2 },
          { name: 'PostgreSQL', level: 4, category: 'Database', yearsExperience: 4 }
        ],
        experiences: [
          {
            company: 'Tech Innovators SAS',
            position: 'Senior Full Stack Developer',
            startDate: '2021-03',
            endDate: 'Present',
            description: 'Développement d\'applications web modernes avec React et Node.js',
            achievements: [
              'Augmentation des performances de 40%',
              'Migration vers TypeScript',
              'Mise en place CI/CD'
            ],
            skills: ['React', 'TypeScript', 'Node.js', 'AWS']
          },
          {
            company: 'Digital Solutions Ltd',
            position: 'Full Stack Developer',
            startDate: '2019-01',
            endDate: '2021-02',
            description: 'Développement de solutions e-commerce',
            achievements: [
              'Développement de 3 applications majeures',
              'Formation de 5 développeurs juniors'
            ],
            skills: ['Vue.js', 'Node.js', 'MongoDB']
          }
        ],
        education: [
          {
            institution: 'École Polytechnique',
            degree: 'Master',
            field: 'Informatique',
            startDate: '2016-09',
            endDate: '2018-06',
            gpa: '16/20'
          }
        ],
        certifications: [
          {
            name: 'AWS Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2022-06',
            expiryDate: '2025-06',
            credentialId: 'AWS-123456'
          }
        ],
        languages: [
          { name: 'Français', proficiency: 'Natif' },
          { name: 'Anglais', proficiency: 'Courant' },
          { name: 'Espagnol', proficiency: 'Intermédiaire' }
        ],
        aiAnalysis: {
          profileSummary: 'Développeur Full Stack senior avec une forte expertise en React et Node.js. Profil orienté résultats avec d\'excellentes compétences techniques et de leadership.',
          strengthAreas: [
            'Architecture Front-End moderne',
            'Développement Full Stack',
            'Leadership technique',
            'Méthodologies Agile'
          ],
          improvementAreas: [
            'Expertise en Machine Learning',
            'Architecture Microservices avancée',
            'Kubernetes et orchestration'
          ],
          careerTrajectory: 'Évolution naturelle vers un rôle de Tech Lead ou Architecte Solutions dans les 2-3 prochaines années.',
          matchScore: 92,
          recommendations: [
            'Formation en architecture cloud avancée',
            'Certification Kubernetes',
            'Développer l\'expertise en IA/ML'
          ]
        }
      };

      setExtractedData(mockExtractedData);
    } catch (err) {
      setError('Erreur lors du traitement du CV');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxFiles: 1
  });

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              i <= level ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const saveEmployee = async () => {
    if (!extractedData) return;
    
    // TODO: Implémenter la sauvegarde en base de données
    console.log('Saving employee data:', extractedData);
  };

  return (
    <div className="space-y-6">
      {/* Zone de drop */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Parser CV Intelligent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
              isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg font-medium">Déposez le CV ici...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Glissez-déposez un CV ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-500">
                  Formats supportés : PDF, DOC, DOCX, JPG, PNG
                </p>
              </>
            )}
          </div>

          {/* Progression */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 space-y-4"
              >
                <Progress value={processingProgress} className="h-2" />
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 " />
                  <span className="text-sm text-gray-600">
                    {processingSteps.find(s => s.step === processingStep)?.label}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Résultats extraits */}
      {extractedData && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Score IA */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full shadow-lg">
                    <Brain className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Score de Correspondance IA</h3>
                    <p className="text-sm text-gray-600">Basé sur l'analyse approfondie du profil</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {extractedData.aiAnalysis.matchScore}%
                  </div>
                  <Badge className="bg-green-100 text-green-800">Excellent Match</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="experience">Expérience</TabsTrigger>
              <TabsTrigger value="education">Formation</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="ai">Analyse IA</TabsTrigger>
            </TabsList>

            {/* Informations personnelles */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{extractedData.personalInfo.firstName} {extractedData.personalInfo.lastName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{extractedData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{extractedData.personalInfo.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{extractedData.personalInfo.address}</span>
                    </div>
                    {extractedData.personalInfo.linkedin && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a href={`https://${extractedData.personalInfo.linkedin}`} className="text-blue-600 hover:underline">
                          LinkedIn
                        </a>
                      </div>
                    )}
                    {extractedData.personalInfo.github && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a href={`https://${extractedData.personalInfo.github}`} className="text-blue-600 hover:underline">
                          GitHub
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compétences */}
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Compétences Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {extractedData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-sm text-gray-500">{skill.category} • {skill.yearsExperience} ans</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderSkillLevel(skill.level)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expérience */}
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Expériences Professionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {extractedData.experiences.map((exp, index) => (
                      <div key={index} className="border-l-2 border-purple-200 pl-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                          </div>
                          <Badge variant="outline">
                            {exp.startDate} - {exp.endDate}
                          </Badge>
                        </div>
                        <p className="text-sm">{exp.description}</p>
                        <div className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <Check className="h-3 w-3 text-green-500 mt-0.5" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {exp.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Formation */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {extractedData.education.map((edu, index) => (
                      <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{edu.degree} - {edu.field}</h4>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          {edu.gpa && <p className="text-sm mt-1">Note : {edu.gpa}</p>}
                        </div>
                        <Badge variant="outline">
                          {edu.startDate} - {edu.endDate}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications */}
            <TabsContent value="certifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {extractedData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          {cert.credentialId && (
                            <p className="text-xs text-gray-500 mt-1">ID: {cert.credentialId}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{cert.date}</Badge>
                          {cert.expiryDate && (
                            <p className="text-xs text-gray-500 mt-1">Expire: {cert.expiryDate}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analyse IA */}
            <TabsContent value="ai">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Analyse IA du Profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Résumé du Profil</h4>
                      <p className="text-sm text-gray-600">{extractedData.aiAnalysis.profileSummary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Star className="h-4 w-4 text-green-500" />
                          Points Forts
                        </h4>
                        <ul className="space-y-1">
                          {extractedData.aiAnalysis.strengthAreas.map((strength, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <Check className="h-3 w-3 text-green-500 mt-0.5" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          Axes d'Amélioration
                        </h4>
                        <ul className="space-y-1">
                          {extractedData.aiAnalysis.improvementAreas.map((area, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <AlertCircle className="h-3 w-3 text-blue-500 mt-0.5" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Trajectoire de Carrière</h4>
                      <p className="text-sm text-gray-600">{extractedData.aiAnalysis.careerTrajectory}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommandations</h4>
                      <div className="space-y-2">
                        {extractedData.aiAnalysis.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm p-2 bg-blue-50 rounded">
                            <Sparkles className="h-4 w-4 text-blue-500 mt-0.5" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Langues */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Langues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {extractedData.languages.map((lang, i) => (
                        <Badge key={i} variant="outline" className="px-3 py-1">
                          {lang.name} - {lang.proficiency}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setExtractedData(null)}>
              Annuler
            </Button>
            <Button 
              onClick={saveEmployee}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Créer l'Employé
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CVParser;