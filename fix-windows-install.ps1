# Script de réparation pour Windows
Write-Host "=== FIX INSTALLATION WINDOWS ===" -ForegroundColor Cyan
Write-Host ""

# 1. Nettoyer les anciens fichiers
Write-Host "[1/5] Nettoyage..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    # Forcer la suppression avec droits admin
    cmd /c "rmdir /s /q node_modules" 2>$null
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
}
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# 2. Créer .npmrc pour éviter les problèmes
Write-Host "[2/5] Configuration npm..." -ForegroundColor Yellow
@"
ignore-scripts=true
legacy-peer-deps=true
"@ | Out-File -FilePath .npmrc -Encoding UTF8

# 3. Installer sans les scripts problématiques
Write-Host "[3/5] Installation des dépendances..." -ForegroundColor Yellow
npm install --force

# 4. Supprimer .npmrc pour le fonctionnement normal
Write-Host "[4/5] Nettoyage configuration..." -ForegroundColor Yellow
Remove-Item -Path .npmrc -Force

# 5. Vérifier l'installation
Write-Host "[5/5] Vérification..." -ForegroundColor Yellow
if (Test-Path "node_modules/express") {
    Write-Host ""
    Write-Host "✅ Installation réussie!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Démarrez maintenant avec:" -ForegroundColor Cyan
    Write-Host "  .\start-windows.ps1" -ForegroundColor White
    Write-Host "ou" -ForegroundColor Gray
    Write-Host "  npm run dev:win" -ForegroundColor White
} else {
    Write-Host "❌ Erreur : Express non trouvé" -ForegroundColor Red
}