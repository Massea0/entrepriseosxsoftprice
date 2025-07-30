// 🚀 PHASE 5 - AUTHENTIFICATION 2FA
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Smartphone, Key, CheckCircle, AlertTriangle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSecurityMonitoring } from "@/utils/security-audit";

interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  isEnabled: boolean;
}

export function TwoFactorAuth() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logEvent } = useSecurityMonitoring();
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'overview' | 'setup' | 'verify' | 'complete'>('overview');

  // Simuler l'état 2FA actuel de l'utilisateur
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    // En production, récupérer l'état 2FA depuis la base de données
    const savedState = localStorage.getItem(`2fa_enabled_${user?.id}`);
    setTwoFactorEnabled(savedState === 'true');
  }, [user?.id]);

  const generateSecret = () => {
    // Générer un secret TOTP (en production, utiliser une librairie crypto sécurisée)
    return Array.from({ length: 32 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');
  };

  const generateBackupCodes = (): string[] => {
    return Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  };

  const initiate2FASetup = async () => {
    setIsLoading(true);
    logEvent({
      type: 'login_attempt',
      severity: 'medium',
      description: '2FA setup initiated',
      userId: user?.id
    });

    try {
      // Simuler la génération des données 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const secret = generateSecret();
      const backupCodes = generateBackupCodes();
      const issuer = "Enterprise OS";
      const accountName = user?.email || "user@example.com";
      const qrCode = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

      setSetup({
        secret,
        qrCode,
        backupCodes,
        isEnabled: false
      });
      
      setStep('setup');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la configuration 2FA",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FACode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Code invalide",
        description: "Veuillez entrer un code à 6 chiffres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simuler la vérification du code TOTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En production, vérifier le code avec la librairie TOTP
      const isValid = Math.random() > 0.3; // Simulation
      
      if (isValid) {
        setTwoFactorEnabled(true);
        localStorage.setItem(`2fa_enabled_${user?.id}`, 'true');
        setStep('complete');
        
        logEvent({
          type: 'login_attempt',
          severity: 'low',
          description: '2FA successfully enabled',
          userId: user?.id
        });

        toast({
          title: "2FA Activé",
          description: "L'authentification à deux facteurs a été activée avec succès",
        });
      } else {
        toast({
          title: "Code incorrect",
          description: "Le code de vérification est incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier le code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(false);
      localStorage.removeItem(`2fa_enabled_${user?.id}`);
      setSetup(null);
      setStep('overview');
      
      logEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        description: '2FA disabled',
        userId: user?.id
      });

      toast({
        title: "2FA Désactivé",
        description: "L'authentification à deux facteurs a été désactivée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de désactiver le 2FA",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Texte copié dans le presse-papier"
    });
  };

  if (step === 'overview') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Authentification à Deux Facteurs (2FA)</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Renforcez la sécurité de votre compte avec une couche d'authentification supplémentaire.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>État du 2FA</span>
              <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                {twoFactorEnabled ? "Activé" : "Désactivé"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {twoFactorEnabled ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    L'authentification à deux facteurs est active sur votre compte.
                    Votre compte est protégé par une couche de sécurité supplémentaire.
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" onClick={disable2FA} disabled={isLoading}>
                  Désactiver le 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Votre compte n'est pas protégé par l'authentification à deux facteurs.
                    Nous recommandons fortement d'activer cette fonctionnalité.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded text-center">
                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Application Mobile</h4>
                    <p className="text-sm text-muted-foreground">
                      Utilisez Google Authenticator, Authy ou une app similaire
                    </p>
                  </div>
                  <div className="p-4 border rounded text-center">
                    <Key className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Codes de Sauvegarde</h4>
                    <p className="text-sm text-muted-foreground">
                      Codes d'urgence en cas de perte du téléphone
                    </p>
                  </div>
                  <div className="p-4 border rounded text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Sécurité Renforcée</h4>
                    <p className="text-sm text-muted-foreground">
                      Protection contre les accès non autorisés
                    </p>
                  </div>
                </div>
                <Button onClick={initiate2FASetup} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <div className=" rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  Activer l'Authentification à Deux Facteurs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'setup' && setup) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Configuration du 2FA</h2>
          <p className="text-muted-foreground">
            Configurez votre application d'authentification
          </p>
        </div>

        <Tabs defaultValue="qr" className="space-y-4">
          <TabsList>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="manual">Configuration Manuelle</TabsTrigger>
            <TabsTrigger value="backup">Codes de Sauvegarde</TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>Scanner le QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded">
                    <QRCodeSVG value={setup.qrCode} size={200} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Scannez ce code avec votre application d'authentification
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Google Authenticator, Authy, Microsoft Authenticator, etc.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Manuelle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="secret">Clé Secrète</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="secret"
                      value={setup.secret}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(setup.secret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Nom du compte:</strong> {user?.email}</p>
                  <p className="text-sm"><strong>Émetteur:</strong> Enterprise OS</p>
                  <p className="text-sm"><strong>Type:</strong> TOTP (Time-based)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Codes de Sauvegarde</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Sauvegardez ces codes en lieu sûr. 
                    Ils vous permettront d'accéder à votre compte si vous perdez votre téléphone.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-2">
                  {setup.backupCodes.map((code, index) => (
                    <div key={index} className="p-2 bg-muted rounded font-mono text-center">
                      {code}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(setup.backupCodes.join('\n'))}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier tous les codes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Vérification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="verification">Code de vérification à 6 chiffres</Label>
              <Input
                id="verification"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-lg tracking-widest font-mono"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setStep('overview')} variant="outline" className="flex-1">
                Annuler
              </Button>
              <Button onClick={verify2FACode} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <div className=" rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                Vérifier et Activer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold">2FA Activé avec Succès!</h2>
          <p className="text-muted-foreground">
            Votre compte est maintenant protégé par l'authentification à deux facteurs.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Prochaines étapes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sauvegardez vos codes de récupération en lieu sûr</li>
                  <li>• Testez votre application d'authentification</li>
                  <li>• Informez vos administrateurs si nécessaire</li>
                </ul>
              </div>
              <Button onClick={() => setStep('overview')} className="w-full">
                Terminer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}