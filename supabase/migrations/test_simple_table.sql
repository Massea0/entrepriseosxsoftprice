-- TEST SIMPLE : Création d'une table basique
-- Si cette migration échoue, il y a un problème de permissions plus large

CREATE TABLE IF NOT EXISTS test_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si ça fonctionne, on peut la supprimer après :
-- DROP TABLE IF EXISTS test_table;