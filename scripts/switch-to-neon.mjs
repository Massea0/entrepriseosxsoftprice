#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔄 RETOUR VERS NEON DB...
');

const filesToRestore = [
  {
    "backup": "server/db-neon.ts.backup",
    "target": "server/db.ts"
  },
  {
    "backup": "server/storage-drizzle.ts.backup",
    "target": "server/storage.ts"
  }
];

for (const file of filesToRestore) {
  const backupPath = path.join(rootDir, file.backup);
  const targetPath = path.join(rootDir, file.target);
  
  if (fs.existsSync(backupPath)) {
    console.log(`✅ Restauration : ${file.backup} → ${file.target}`);
    fs.copyFileSync(backupPath, targetPath);
  } else {
    console.log(`❌ Backup manquant : ${file.backup}`);
  }
}

console.log('\n✅ Retour à Neon DB effectué !');
