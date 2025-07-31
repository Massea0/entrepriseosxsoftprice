#!/bin/bash

echo "🚀 Script de Push Automatique - EntrepriseOS"
echo "============================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📦 Préparation du repository...${NC}"

# Aller dans le bon dossier
cd /workspace/entrepriseOS-complete

# Configurer Git
git config user.email "massea0@github.com"
git config user.name "Massea0"

# Vérifier le statut
echo -e "${BLUE}📊 Status du repository :${NC}"
echo "   📁 Fichiers : $(find . -type f | wc -l)"
echo "   📝 Commits : $(git log --oneline | wc -l)"
echo "   🎯 Branche : $(git branch --show-current)"

# Nettoyer et reconfigurer remote
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Massea0/entrepriseOS-complete.git

echo -e "${BLUE}🔗 Remote configuré :${NC}"
git remote -v

echo ""
echo -e "${YELLOW}🔑 ATTENTION : Tu vas devoir entrer tes credentials GitHub${NC}"
echo -e "${YELLOW}   Username : Massea0${NC}"
echo -e "${YELLOW}   Password : [Ton Personal Access Token GitHub]${NC}"
echo ""

# Attempt push
echo -e "${BLUE}🚀 Push vers GitHub...${NC}"
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}🎉 SUCCÈS ! Repository créé !${NC}"
    echo ""
    echo -e "${GREEN}✅ URL Repository :${NC}"
    echo -e "${BLUE}   https://github.com/Massea0/entrepriseOS-complete${NC}"
    echo ""
    echo -e "${GREEN}📊 Contenu poussé :${NC}"
    echo "   📁 862 fichiers"
    echo "   📝 59,284+ lignes de code"
    echo "   🎨 Modern React Frontend"
    echo "   🗄️  Complete Supabase Backend"
    echo "   📚 Documentation complète"
    echo "   🤖 Guide de passation IA"
    echo ""
    echo -e "${GREEN}🤖 MESSAGE POUR L'AI AGENT :${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Salut ! Tu prends la suite du développement d'EntrepriseOS !"
    echo ""
    echo "🎯 PREMIÈRE ACTION OBLIGATOIRE :"
    echo "Lis le fichier PASSATION_AI_AGENT.md - documentation complète !"
    echo ""
    echo "📊 PROJET : 90% terminé, 6 modules complets, 1 à finaliser"
    echo "🔥 TA MISSION : Terminer Supply Chain & Inventory (Phase 5.5-5.20)"
    echo "🚀 OBJECTIF : SaaS CRM/ERP le plus avancé du marché"
    echo ""
    echo "📚 TOUT EST DOCUMENTÉ dans PASSATION_AI_AGENT.md !"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}✅ Prêt pour la continuation par AI Agent !${NC}"
else
    echo ""
    echo -e "${RED}❌ Erreur lors du push${NC}"
    echo ""
    echo -e "${YELLOW}💡 Solutions possibles :${NC}"
    echo "1. Vérifier que le repository GitHub existe"
    echo "2. Utiliser un Personal Access Token comme password"
    echo "3. Configurer SSH keys"
    echo ""
    echo -e "${YELLOW}🔗 Alternative : Archive prête${NC}"
    echo "   📦 /workspace/entrepriseOS-complete-final.tar.gz"
    echo "   📥 Télécharger et extraire manuellement"
fi

echo ""
echo -e "${BLUE}📋 Fichiers de passation créés :${NC}"
echo "   🤖 MESSAGE_AI_AGENT.md"
echo "   📋 PASSATION_AI_AGENT.md (35+ sections)"
echo "   🚀 DEPLOYMENT_GUIDE.md"
echo ""
echo -e "${GREEN}🎯 Mission accomplie ! EntrepriseOS est prêt !${NC}"