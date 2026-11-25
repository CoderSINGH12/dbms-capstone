-- ============================================================================
-- 16_final_standings.sql
-- Seed official verified final standings for reconciliation checking
-- ============================================================================

USE fcb_laliga_db;

-- 2023/24 Verified Official Table (season_id = 2)
INSERT INTO final_standings (season_id, team_id, position, played, won, drawn, lost, gf, ga, points) VALUES
(2, 2,  1, 38, 29, 8,  1,  87, 26, 95), -- Real Madrid
(2, 1,  2, 38, 26, 7,  5,  79, 44, 85), -- FC Barcelona
(2, 10, 3, 38, 25, 6,  7,  85, 46, 81), -- Girona
(2, 3,  4, 38, 24, 4,  10, 70, 43, 76), -- Atlético Madrid
(2, 4,  5, 38, 19, 11, 8,  61, 37, 68), -- Athletic Club
(2, 5,  6, 38, 16, 12, 10, 51, 39, 60), -- Real Sociedad
(2, 6,  7, 38, 14, 15, 9,  48, 45, 57), -- Real Betis
(2, 8,  8, 38, 14, 11, 13, 65, 65, 53), -- Villarreal
(2, 9,  9, 38, 13, 10, 15, 40, 45, 49), -- Valencia
(2, 16, 10, 38, 12, 10, 16, 36, 46, 46), -- Alavés
(2, 12, 11, 38, 12, 9,  17, 45, 56, 45), -- Osasuna
(2, 13, 12, 38, 10, 13, 15, 42, 54, 43), -- Getafe
(2, 11, 13, 38, 10, 11, 17, 46, 57, 41), -- Celta Vigo
(2, 7,  14, 38, 10, 11, 17, 48, 54, 41), -- Sevilla
(2, 15, 15, 38, 8,  16, 14, 33, 44, 40), -- Mallorca
(2, 17, 16, 38, 10, 10, 18, 33, 47, 40), -- Las Palmas
(2, 14, 17, 38, 8,  14, 16, 29, 48, 38)  -- Rayo Vallecano
ON DUPLICATE KEY UPDATE 
  position=VALUES(position), 
  played=VALUES(played), 
  won=VALUES(won), 
  drawn=VALUES(drawn), 
  lost=VALUES(lost), 
  gf=VALUES(gf), 
  ga=VALUES(ga), 
  points=VALUES(points);

-- 2022/23 Verified Official Table (season_id = 3) - FC Barcelona Champions
INSERT INTO final_standings (season_id, team_id, position, played, won, drawn, lost, gf, ga, points) VALUES
(3, 1,  1, 38, 28, 4, 6,  70, 20, 88), -- FC Barcelona (Champions - 20 conceded!)
(3, 2,  2, 38, 24, 6, 8,  75, 36, 78), -- Real Madrid
(3, 3,  3, 38, 23, 8, 7,  70, 33, 77), -- Atlético Madrid
(3, 5,  4, 38, 21, 8, 9,  51, 35, 71), -- Real Sociedad
(3, 8,  5, 38, 19, 7, 12, 59, 40, 64), -- Villarreal
(3, 6,  6, 38, 17, 9, 12, 46, 41, 60), -- Real Betis
(3, 12, 7, 38, 15, 8, 15, 37, 42, 53)  -- Osasuna
ON DUPLICATE KEY UPDATE points=VALUES(points);

-- 2014/15 Verified Official Table (season_id = 6) - Treble Season
INSERT INTO final_standings (season_id, team_id, position, played, won, drawn, lost, gf, ga, points) VALUES
(6, 1, 1, 38, 30, 4, 4, 110, 21, 94), -- FC Barcelona (Treble Champions)
(6, 2, 2, 38, 30, 2, 6, 118, 38, 92), -- Real Madrid
(6, 3, 3, 38, 23, 9, 6, 67,  29, 78), -- Atlético Madrid
(6, 9, 4, 38, 22, 11, 5, 70,  32, 77), -- Valencia
(6, 7, 5, 38, 23, 7,  8, 71,  45, 76)  -- Sevilla
ON DUPLICATE KEY UPDATE points=VALUES(points);
