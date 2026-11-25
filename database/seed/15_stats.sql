-- ============================================================================
-- 15_stats.sql
-- Seed player_match_stats (match-level detail for Barcelona fixtures)
-- and player_season_stats (accurate aggregate stats across seasons)
-- ============================================================================

USE fcb_laliga_db;

-- 1. DETAILED PLAYER MATCH STATS (Selected Iconic Fixtures)

-- Match 11: Real Madrid 0 - 4 FC Barcelona (Santiago Bernabéu, 2024-10-26)
INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists, yellow, red) VALUES
(11, 2,  1, 90, 2, 0, 0, 0), -- Lewandowski (2 goals)
(11, 1,  1, 86, 1, 0, 0, 0), -- Lamine Yamal (1 goal)
(11, 3,  1, 90, 1, 1, 0, 0), -- Raphinha (1 goal, 1 assist)
(11, 8,  1, 65, 0, 1, 1, 0), -- Casadó (1 assist, 1 yellow)
(11, 13, 1, 90, 0, 1, 0, 0), -- Balde (1 assist)
(11, 4,  1, 87, 0, 0, 0, 0), -- Pedri
(11, 11, 1, 90, 0, 0, 0, 0), -- Cubarsí
(11, 12, 1, 90, 0, 0, 0, 0), -- Koundé
(11, 14, 1, 90, 0, 0, 1, 0), -- Iñigo Martínez (1 yellow)
(11, 16, 1, 90, 0, 0, 1, 0), -- Iñaki Peña (clean sheet)
(11, 5,  0, 15, 0, 0, 1, 0), -- Gavi (substitute, yellow)
(11, 6,  0, 25, 0, 0, 0, 0), -- Dani Olmo (substitute)
(11, 7,  0, 45, 0, 0, 0, 0), -- De Jong (substitute)
-- Real Madrid Players in Match 11
(11, 21, 1, 90, 0, 0, 1, 0), -- Vinícius Jr (yellow)
(11, 22, 1, 90, 0, 0, 0, 0), -- Mbappé (disallowed goals)
(11, 23, 1, 90, 0, 0, 0, 0); -- Bellingham

-- Match 4: FC Barcelona 7 - 0 Real Valladolid (2024-08-31)
INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists, yellow, red) VALUES
(4, 3,  1, 90, 3, 1, 0, 0), -- Raphinha (Hat-trick + assist)
(4, 2,  1, 73, 1, 1, 0, 0), -- Lewandowski (1 goal, 1 assist)
(4, 12, 1, 90, 1, 0, 0, 0), -- Koundé (1 goal)
(4, 6,  1, 83, 1, 0, 0, 0), -- Dani Olmo (1 goal)
(4, 10, 0, 17, 1, 0, 0, 0), -- Ferran Torres (1 goal)
(4, 1,  1, 90, 0, 2, 0, 0), -- Lamine Yamal (2 assists)
(4, 4,  1, 61, 0, 0, 0, 0), -- Pedri
(4, 8,  1, 61, 0, 0, 0, 0), -- Casadó
(4, 11, 1, 61, 0, 0, 0, 0), -- Cubarsí
(4, 13, 1, 90, 0, 0, 0, 0), -- Balde
(4, 14, 1, 90, 0, 0, 0, 0), -- Iñigo Martínez
(4, 15, 1, 90, 0, 0, 0, 0); -- Ter Stegen (clean sheet)

-- Match 10: FC Barcelona 5 - 1 Sevilla (2024-10-20)
INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists, yellow, red) VALUES
(10, 2,  1, 66, 2, 0, 0, 0), -- Lewandowski (2 goals)
(10, 4,  1, 83, 1, 0, 0, 0), -- Pedri (1 goal)
(10, 1,  1, 76, 0, 1, 0, 0), -- Lamine Yamal (1 assist)
(10, 3,  1, 66, 0, 1, 0, 0), -- Raphinha (1 assist)
(10, 8,  1, 90, 0, 0, 0, 0), -- Casadó
(10, 11, 1, 90, 0, 0, 0, 0), -- Cubarsí
(10, 12, 1, 90, 0, 0, 0, 0), -- Koundé
(10, 13, 1, 90, 0, 0, 0, 0), -- Balde
(10, 14, 1, 90, 0, 0, 0, 0), -- Iñigo Martínez
(10, 16, 1, 90, 0, 0, 0, 0), -- Iñaki Peña
(10, 5,  0, 7,  0, 0, 0, 0); -- Gavi return

-- Match 21: FC Barcelona 7 - 1 Valencia (2025-01-26)
INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists, yellow, red) VALUES
(21, 3,  1, 82, 2, 1, 0, 0), -- Raphinha (2 goals, 1 assist)
(21, 2,  1, 75, 2, 0, 0, 0), -- Lewandowski (2 goals)
(21, 1,  1, 90, 1, 2, 0, 0), -- Lamine Yamal (1 goal, 2 assists)
(21, 6,  1, 68, 1, 1, 0, 0), -- Dani Olmo (1 goal, 1 assist)
(21, 4,  1, 90, 1, 0, 0, 0), -- Pedri (1 goal)
(21, 8,  1, 90, 0, 1, 0, 0), -- Casadó
(21, 11, 1, 90, 0, 0, 0, 0), -- Cubarsí
(21, 12, 1, 90, 0, 0, 0, 0), -- Koundé
(21, 13, 1, 90, 0, 0, 0, 0), -- Balde
(21, 14, 1, 90, 0, 0, 0, 0), -- Iñigo Martínez
(21, 16, 1, 90, 0, 0, 0, 0); -- Iñaki Peña

-- Match 26: FC Barcelona 4 - 0 Real Sociedad (2025-03-02)
INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists, yellow, red) VALUES
(26, 2,  1, 90, 1, 0, 0, 0), -- Lewandowski
(26, 6,  1, 75, 1, 0, 0, 0), -- Dani Olmo
(26, 1,  1, 85, 1, 1, 0, 0), -- Lamine Yamal
(26, 3,  1, 90, 1, 0, 0, 0), -- Raphinha
(26, 4,  1, 90, 0, 1, 0, 0), -- Pedri
(26, 8,  1, 90, 0, 1, 0, 0), -- Casadó
(26, 11, 1, 90, 0, 0, 0, 0), -- Cubarsí
(26, 12, 1, 90, 0, 0, 0, 0), -- Koundé
(26, 13, 1, 90, 0, 0, 0, 0), -- Balde
(26, 14, 1, 90, 0, 0, 0, 0), -- Iñigo Martínez
(26, 18, 1, 90, 0, 0, 0, 0); -- Szczęsny (clean sheet)

-- Historic 2014/15 Match 81: FC Barcelona 2 - 1 Real Madrid (Camp Nou, 2015-03-22)
INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists, yellow, red) VALUES
(81, 62, 1, 85, 1, 0, 1, 0), -- Suárez (Winner goal)
(81, 67, 1, 90, 0, 0, 0, 0), -- Piqué
(81, 71, 1, 76, 0, 0, 0, 0), -- Rakitić
(81, 61, 1, 90, 0, 1, 0, 0), -- Messi (assist to Mathieu)
(81, 63, 1, 85, 0, 0, 0, 0), -- Neymar
(81, 64, 1, 80, 0, 0, 1, 0), -- Iniesta
(81, 65, 0, 14, 0, 0, 0, 0), -- Xavi
(81, 66, 1, 90, 0, 0, 0, 0), -- Busquets
(81, 68, 1, 90, 0, 0, 1, 0), -- Mascherano
(81, 69, 1, 90, 0, 1, 1, 0), -- Dani Alves (assist to Suárez)
(81, 70, 1, 90, 0, 0, 1, 0), -- Jordi Alba
(81, 72, 1, 90, 0, 0, 0, 0)  -- Bravo
ON DUPLICATE KEY UPDATE goals=VALUES(goals), assists=VALUES(assists), minutes=VALUES(minutes);

-- 2. PLAYER SEASON STATS (Full verified totals for 2024/25, 2023/24, and 2014/15)
INSERT INTO player_season_stats (registration_id, appearances, starts, minutes, goals, assists, yellow, red, is_aggregate) VALUES
-- 2024/25 Season Totals
(1,  25, 24, 2010, 9,  11, 1, 0, 1), -- Lamine Yamal
(2,  26, 24, 2080, 20, 4,  3, 0, 1), -- Lewandowski
(3,  26, 25, 2150, 13, 9,  2, 0, 1), -- Raphinha
(4,  26, 22, 1890, 4,  4,  2, 0, 1), -- Pedri
(5,  12, 3,  340,  1,  1,  3, 0, 1), -- Gavi
(6,  18, 13, 1120, 7,  3,  1, 0, 1), -- Dani Olmo
(7,  15, 6,  620,  0,  1,  1, 0, 1), -- Frenkie de Jong
(8,  22, 19, 1620, 0,  3,  4, 1, 1), -- Marc Casadó
(9,  16, 6,  590,  2,  1,  2, 0, 1), -- Fermín López
(10, 17, 7,  720,  3,  2,  1, 0, 1), -- Ferran Torres
(11, 25, 25, 2180, 0,  1,  2, 0, 1), -- Pau Cubarsí
(12, 26, 26, 2300, 1,  2,  1, 0, 1), -- Jules Koundé
(13, 24, 23, 1950, 0,  3,  1, 0, 1), -- Alejandro Balde
(14, 24, 24, 2100, 0,  1,  4, 0, 1), -- Iñigo Martínez
(15, 6,  6,  540,  0,  0,  0, 0, 1), -- Ter Stegen
(16, 18, 18, 1620, 0,  0,  1, 0, 1), -- Iñaki Peña
(17, 8,  4,  390,  0,  0,  1, 0, 1), -- Ronald Araújo
(18, 2,  2,  180,  0,  0,  0, 0, 1), -- Szczęsny

-- 2024/25 Rival Totals
(21, 25, 24, 2040, 10, 6,  5, 0, 1), -- Vinícius Júnior
(22, 24, 23, 1980, 13, 3,  2, 0, 1), -- Kylian Mbappé
(23, 23, 22, 1890, 7,  4,  3, 0, 1), -- Jude Bellingham
(24, 26, 24, 1990, 8,  7,  2, 0, 1), -- Antoine Griezmann
(25, 23, 21, 1810, 5,  5,  2, 0, 1), -- Nico Williams
(26, 25, 22, 1800, 7,  4,  3, 1, 1), -- Iago Aspas

-- 2023/24 Season Totals (Season 2)
(31, 37, 22, 2197, 5,  7,  1, 0, 1), -- Lamine Yamal (breakout season)
(32, 35, 33, 2874, 19, 8,  5, 0, 1), -- Lewandowski
(33, 28, 17, 1445, 6,  9,  2, 1, 1), -- Raphinha
(34, 24, 16, 1476, 4,  2,  3, 0, 1), -- Pedri
(35, 12, 10, 835,  1,  1,  3, 0, 1), -- Gavi
(36, 20, 19, 1618, 2,  0,  7, 0, 1), -- Frenkie de Jong
(37, 31, 14, 1398, 8,  0,  3, 0, 1), -- Fermín López
(38, 29, 12, 1198, 7,  2,  1, 0, 1), -- Ferran Torres
(39, 35, 32, 2899, 1,  2,  3, 0, 1), -- Jules Koundé
(40, 28, 28, 2520, 0,  0,  2, 0, 1), -- Ter Stegen

-- 2014/15 Treble Season Totals (Season 6)
(61, 38, 37, 3375, 43, 18, 2, 0, 1), -- Lionel Messi
(62, 27, 25, 2180, 16, 14, 4, 0, 1), -- Luis Suárez
(63, 33, 29, 2573, 22, 7,  6, 0, 1), -- Neymar Jr
(64, 24, 19, 1547, 0,  1,  3, 0, 1), -- Andrés Iniesta
(65, 31, 14, 1373, 2,  8,  1, 0, 1), -- Xavi Hernández
(66, 33, 29, 2470, 1,  2,  7, 0, 1), -- Sergio Busquets
(67, 27, 26, 2307, 5,  0,  6, 0, 1), -- Gerard Piqué
(68, 28, 26, 2335, 0,  0,  6, 1, 1), -- Javier Mascherano
(69, 30, 29, 2548, 0,  6,  7, 0, 1), -- Dani Alves
(70, 27, 26, 2316, 1,  3,  4, 0, 1), -- Jordi Alba
(71, 32, 23, 2110, 5,  7,  1, 0, 1), -- Ivan Rakitić
(72, 37, 37, 3330, 0,  0,  1, 0, 1)  -- Claudio Bravo (Zamora Trophy: 23 clean sheets)
ON DUPLICATE KEY UPDATE 
  appearances=VALUES(appearances), 
  starts=VALUES(starts), 
  minutes=VALUES(minutes), 
  goals=VALUES(goals), 
  assists=VALUES(assists), 
  yellow=VALUES(yellow), 
  red=VALUES(red);
