@echo off
echo === FIX INSTALLATION WINDOWS ===
echo.

echo [1/4] Nettoyage...
rmdir /s /q node_modules 2>nul
del /f /q package-lock.json 2>nul

echo [2/4] Installation avec npm (ignore scripts)...
npm install --ignore-scripts --force

echo [3/4] Suppression .npmrc...
del /f /q .npmrc 2>nul

echo [4/4] Verification...
if exist "node_modules\express" (
    echo.
    echo Installation reussie!
    echo.
    echo Demarrez avec: start-windows.bat
) else (
    echo.
    echo ERREUR: Express non trouve
)

pause