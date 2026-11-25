-- ============================================================================
-- 11_teams.sql
-- Seed 20 core La Liga clubs with stadiums, cities, TLAs, and founded years
-- ============================================================================

USE fcb_laliga_db;

INSERT INTO teams (id, name, short_name, tla, crest_url, city, stadium, founded_year) VALUES
(1, 'FC Barcelona', 'Barcelona', 'FCB', 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', 'Barcelona', 'Spotify Camp Nou', 1899),
(2, 'Real Madrid CF', 'Real Madrid', 'RMA', 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', 'Madrid', 'Santiago Bernabéu', 1902),
(3, 'Club Atlético de Madrid', 'Atlético Madrid', 'ATM', 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg', 'Madrid', 'Cívitas Metropolitano', 1903),
(4, 'Athletic Club', 'Athletic Club', 'ATH', 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg', 'Bilbao', 'San Mamés', 1898),
(5, 'Real Sociedad de Fútbol', 'Real Sociedad', 'RSO', 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg', 'San Sebastián', 'Reale Arena', 1909),
(6, 'Real Betis Balompié', 'Real Betis', 'BET', 'https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg', 'Seville', 'Benito Villamarín', 1907),
(7, 'Sevilla FC', 'Sevilla', 'SEV', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg', 'Seville', 'Ramón Sánchez-Pizjuán', 1890),
(8, 'Villarreal CF', 'Villarreal', 'VIL', 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg', 'Villarreal', 'Estadio de la Cerámica', 1923),
(9, 'Valencia CF', 'Valencia', 'VAL', 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg', 'Valencia', 'Mestalla', 1919),
(10, 'Girona FC', 'Girona', 'GIR', 'https://upload.wikimedia.org/wikipedia/en/7/79/Girona_FC_logo.svg', 'Girona', 'Montilivi', 1930),
(11, 'RC Celta de Vigo', 'Celta Vigo', 'CEL', 'https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg', 'Vigo', 'Abanca-Balaídos', 1923),
(12, 'CA Osasuna', 'Osasuna', 'OSA', 'https://upload.wikimedia.org/wikipedia/en/d/db/Osasuna_logo.svg', 'Pamplona', 'El Sadar', 1920),
(13, 'Getafe CF', 'Getafe', 'GET', 'https://upload.wikimedia.org/wikipedia/en/7/7f/Getafe_cf_logo.svg', 'Getafe', 'Coliseum', 1983),
(14, 'Rayo Vallecano', 'Rayo Vallecano', 'RAY', 'https://upload.wikimedia.org/wikipedia/en/1/17/Rayo_Vallecano_logo.svg', 'Madrid', 'Campo de Fútbol de Vallecas', 1924),
(15, 'RCD Mallorca', 'Mallorca', 'MLL', 'https://upload.wikimedia.org/wikipedia/en/e/e0/RCD_Mallorca_logo.svg', 'Palma', 'Estadi Mallorca Son Moix', 1916),
(16, 'Deportivo Alavés', 'Alavés', 'ALA', 'https://upload.wikimedia.org/wikipedia/en/f/f8/Deportivo_Alaves_logo_%282020%29.svg', 'Vitoria-Gasteiz', 'Mendizorrotza', 1921),
(17, 'UD Las Palmas', 'Las Palmas', 'LPA', 'https://upload.wikimedia.org/wikipedia/en/b/b5/UD_Las_Palmas_logo.svg', 'Las Palmas', 'Gran Canaria', 1949),
(18, 'RCD Espanyol', 'Espanyol', 'ESP', 'https://upload.wikimedia.org/wikipedia/en/d/d6/Rcd_espanyol_logo.svg', 'Barcelona', 'RCDE Stadium', 1900),
(19, 'CD Leganés', 'Leganés', 'LEG', 'https://upload.wikimedia.org/wikipedia/en/0/02/CD_Legan%C3%A9s_logo.svg', 'Leganés', 'Estadio Municipal de Butarque', 1928),
(20, 'Real Valladolid CF', 'Real Valladolid', 'VLD', 'https://upload.wikimedia.org/wikipedia/en/6/69/Real_Valladolid_logo.svg', 'Valladolid', 'José Zorrilla', 1928)
ON DUPLICATE KEY UPDATE 
  short_name=VALUES(short_name), 
  tla=VALUES(tla), 
  crest_url=VALUES(crest_url), 
  city=VALUES(city), 
  stadium=VALUES(stadium);
