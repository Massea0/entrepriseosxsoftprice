import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function debugUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Vérification de l\'utilisateur manager...');
    
    // Rechercher l'utilisateur manager@arcadis.tech
    const result = await pool.query(
      'SELECT id, email, role, first_name, last_name FROM users WHERE email = $1',
      ['manager@arcadis.tech']
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('✅ Utilisateur trouvé:');
      console.log('  - ID:', user.id);
      console.log('  - Email:', user.email);
      console.log('  - Rôle:', user.role);
      console.log('  - Nom:', user.first_name, user.last_name);
    } else {
      console.log('❌ Utilisateur manager@arcadis.tech non trouvé');
      
      // Lister tous les utilisateurs
      const allUsers = await pool.query('SELECT id, email, role FROM users');
      console.log('\n📋 Tous les utilisateurs:');
      allUsers.rows.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

debugUser(); 