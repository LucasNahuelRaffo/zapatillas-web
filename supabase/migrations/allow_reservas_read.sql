-- Ejecutar en Supabase Dashboard → SQL Editor → New query

-- Habilita RLS en la tabla de reservas
ALTER TABLE reservas_zapatillas ENABLE ROW LEVEL SECURITY;

-- Permite SELECT a cualquier usuario (anon incluido)
CREATE POLICY "allow_anon_select"
  ON reservas_zapatillas
  FOR SELECT
  USING (true);

-- Permite INSERT a cualquier usuario (para el flujo de checkout)
CREATE POLICY "allow_anon_insert"
  ON reservas_zapatillas
  FOR INSERT
  WITH CHECK (true);
