// 🚀 PHASE 5 - AUDIT DE SÉCURITÉ ET OUTILS
// Security audit utility - migrated from Supabase to Express API

// ===============================
// AUDIT DE SÉCURITÉ
// ===============================

export interface SecurityAuditResult {
  score: number;
  vulnerabilities: SecurityVulnerability[];
  recommendations: SecurityRecommendation[];
  compliance: ComplianceStatus;
}

export interface SecurityVulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  impact: string;
  remediation: string;
  cvss?: number;
}

export interface SecurityRecommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
  effort: 'low' | 'medium' | 'high';
}

export interface ComplianceStatus {
  rgpd: boolean;
  iso27001: boolean;
  owasp: number; // Score OWASP 0-10
  pciDss: boolean;
}

export class SecurityAuditor {
  private auditLog: SecurityEvent[] = [];

  async performFullAudit(): Promise<SecurityAuditResult> {
    const vulnerabilities: SecurityVulnerability[] = [];
    const recommendations: SecurityRecommendation[] = [];

    // 1. Audit Authentication
    const authVulns = await this.auditAuthentication();
    vulnerabilities.push(...authVulns);

    // 2. Audit Database Security
    const dbVulns = await this.auditDatabase();
    vulnerabilities.push(...dbVulns);

    // 3. Audit API Security
    const apiVulns = await this.auditApiSecurity();
    vulnerabilities.push(...apiVulns);

    // 4. Audit Client-Side Security
    const clientVulns = await this.auditClientSide();
    vulnerabilities.push(...clientVulns);

    // 5. Générer recommandations
    recommendations.push(...this.generateRecommendations(vulnerabilities));

    // 6. Calculer score global
    const score = this.calculateSecurityScore(vulnerabilities);

    // 7. Vérifier conformité
    const compliance = await this.checkCompliance();

    return {
      score,
      vulnerabilities,
      recommendations,
      compliance
    };
  }

  private async auditAuthentication(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Vérifier la configuration d'authentification
    try {
      // Check authentication status via API
      const response = await fetch('/api/auth/session');
      const session = response.ok ? await response.json() : null;
      
      // Pas de 2FA
      vulnerabilities.push({
        id: 'auth-001',
        severity: 'high',
        category: 'Authentication',
        description: 'Two-Factor Authentication (2FA) non configuré',
        impact: 'Risque d\'accès non autorisé aux comptes utilisateurs',
        remediation: 'Implémenter 2FA avec TOTP ou SMS',
        cvss: 7.5
      });

      // Session timeout non configuré
      vulnerabilities.push({
        id: 'auth-002',
        severity: 'medium',
        category: 'Authentication',
        description: 'Timeout de session non configuré',
        impact: 'Sessions peuvent rester actives indéfiniment',
        remediation: 'Configurer timeout automatique des sessions'
      });

    } catch (error) {
      vulnerabilities.push({
        id: 'auth-003',
        severity: 'critical',
        category: 'Authentication',
        description: 'Erreur lors de l\'audit d\'authentification',
        impact: 'Impossible de vérifier la sécurité de l\'authentification',
        remediation: 'Investiguer et corriger les erreurs d\'authentification'
      });
    }

    return vulnerabilities;
  }

  private async auditDatabase(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    try {
      // Vérifier la sécurité base de données
      const response = await fetch('/api/security/database-schema');
      const tables = response.ok ? await response.json() : null;
      
      if (!tables) {
        vulnerabilities.push({
          id: 'db-001',
          severity: 'critical',
          category: 'Database',
          description: 'Impossible d\'accéder au schéma de base de données',
          impact: 'Audit de sécurité incomplet',
          remediation: 'Vérifier les permissions d\'accès à la base'
        });
        return vulnerabilities;
      }

      // Analyser les politiques RLS
      // Note: Cette analyse serait plus détaillée en production
      vulnerabilities.push({
        id: 'db-002',
        severity: 'medium',
        category: 'Database',
        description: 'Chiffrement au niveau base de données non vérifié',
        impact: 'Données sensibles potentiellement exposées',
        remediation: 'Implémenter chiffrement transparent des données'
      });

    } catch (error) {
      vulnerabilities.push({
        id: 'db-003',
        severity: 'high',
        category: 'Database',
        description: 'Erreur lors de l\'audit de base de données',
        impact: 'Sécurité de la base non vérifiée',
        remediation: 'Investiguer les erreurs d\'accès à la base'
      });
    }

    return vulnerabilities;
  }

  private async auditApiSecurity(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Vérifier les headers de sécurité
    if (!this.checkSecurityHeaders()) {
      vulnerabilities.push({
        id: 'api-001',
        severity: 'medium',
        category: 'API Security',
        description: 'Headers de sécurité manquants',
        impact: 'Vulnérabilités XSS, CSRF, clickjacking',
        remediation: 'Implémenter CSP, HSTS, X-Frame-Options'
      });
    }

    // Rate limiting
    vulnerabilities.push({
      id: 'api-002',
      severity: 'high',
      category: 'API Security',
      description: 'Rate limiting non configuré',
      impact: 'Vulnérable aux attaques DDoS et brute force',
      remediation: 'Implémenter rate limiting sur les APIs'
    });

    return vulnerabilities;
  }

  private auditClientSide(): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Vérifier le stockage local
    if (this.checkLocalStorageSecurity()) {
      vulnerabilities.push({
        id: 'client-001',
        severity: 'medium',
        category: 'Client Security',
        description: 'Données sensibles stockées en local',
        impact: 'Exposition possible des données via XSS',
        remediation: 'Utiliser sessionStorage ou chiffrer les données locales'
      });
    }

    // Content Security Policy
    if (!this.checkCSP()) {
      vulnerabilities.push({
        id: 'client-002',
        severity: 'high',
        category: 'Client Security',
        description: 'Content Security Policy non configuré',
        impact: 'Vulnérable aux attaques XSS',
        remediation: 'Configurer CSP strict'
      });
    }

    return vulnerabilities;
  }

  private generateRecommendations(vulnerabilities: SecurityVulnerability[]): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];

    const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

    if (criticalCount > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Corriger immédiatement les vulnérabilités critiques',
        description: `${criticalCount} vulnérabilité(s) critique(s) détectée(s)`,
        implementation: 'Prioriser les corrections dans les 24h',
        effort: 'high'
      });
    }

    if (highCount > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Implémenter l\'authentification à deux facteurs',
        description: 'Renforcer la sécurité des comptes utilisateurs',
        implementation: 'Utiliser TOTP avec Google Authenticator',
        effort: 'medium'
      });
    }

    recommendations.push({
      priority: 'medium',
      title: 'Mettre en place un monitoring de sécurité',
      description: 'Surveillance proactive des menaces',
      implementation: 'Logs centralisés + alertes automatiques',
      effort: 'high'
    });

    return recommendations;
  }

  private calculateSecurityScore(vulnerabilities: SecurityVulnerability[]): number {
    let score = 100;
    
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
  }

    });

    return Math.max(0, score);
  }

  private async checkCompliance(): Promise<ComplianceStatus> {
    // Simulation de vérification de conformité
    return {
      rgpd: false, // À implémenter
      iso27001: false, // À implémenter
      owasp: 3, // Score actuel estimé
      pciDss: false // À implémenter
    };
  }

  private checkSecurityHeaders(): boolean {
    // Vérifier si les headers de sécurité sont présents
    // En production, cela ferait un appel HTTP pour vérifier
    return false;
  }

  private checkLocalStorageSecurity(): boolean {
    // Vérifier si des données sensibles sont en localStorage
    const sensitiveKeys = ['password', 'token', 'secret', 'key'];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        return true;
      }
    }
    return false;
  }

  private checkCSP(): boolean {
    // Vérifier si CSP est configuré
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return !!metaCSP;
  }

  // Logging des événements de sécurité
  logSecurityEvent(event: SecurityEvent): void {
    this.auditLog.push({
      ...event,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      ip: 'client-side' // En production, obtenir l'IP côté serveur
    });

    // En production, envoyer vers un service de logging sécurisé
    console.warn('🔒 Security Event:', event);
  }
}

export interface SecurityEvent {
  type: 'login_attempt' | 'data_access' | 'permission_denied' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
  userAgent?: string;
  ip?: string;
}

// Instance globale de l'auditeur
export const securityAuditor = new SecurityAuditor();

// Hook pour l'audit en temps réel
export function useSecurityMonitoring() {
  const logEvent = (event: Omit<SecurityEvent, 'timestamp'>) => {
    securityAuditor.logSecurityEvent(event);
  };

  return { logEvent };
}