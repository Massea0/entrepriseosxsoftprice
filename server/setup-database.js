import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupLeaveTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔗 Connexion à la base de données...');
    
    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'setup-leave-tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📝 Application des tables de congés...');
    
    // Exécuter le script SQL
    await pool.query(sql);
    
    console.log('✅ Tables de congés créées avec succès !');
    
    // Vérifier que les tables ont été créées
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('leave_types', 'leave_requests', 'leave_balances', 'leave_policies')
      ORDER BY table_name
    `);
    
    console.log('📊 Tables créées :');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Vérifier les types de congés insérés
    const leaveTypes = await pool.query('SELECT name, default_days, color FROM leave_types');
    console.log('\n🎨 Types de congés disponibles :');
    leaveTypes.rows.forEach(type => {
      console.log(`  - ${type.name} (${type.default_days} jours, couleur: ${type.color})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables :', error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
setupLeaveTables(); 