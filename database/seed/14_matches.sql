-- ============================================================================
-- 14_matches.sql
-- Seed authentic La Liga matches (2024/25 campaign, 2023/24, and historic fixtures)
-- ============================================================================

USE fcb_laliga_db;

-- 2024/25 Season (season_id = 1)
INSERT INTO matches (id, season_id, matchday, home_team_id, away_team_id, kickoff_utc, status, home_score, away_score, venue, referee) VALUES
-- Finished Barcelona Fixtures 2024/25
(1,  1, 1,  9,  1,  '2024-08-17 19:30:00', 'finished', 1, 2, 'Mestalla', 'José María Sánchez Martínez'),
(2,  1, 2,  1,  4,  '2024-08-24 17:00:00', 'finished', 2, 1, 'Estadi Olímpic Lluís Companys', 'Jesús Gil Manzano'),
(3,  1, 3,  14, 1,  '2024-08-27 19:30:00', 'finished', 1, 2, 'Campo de Vallecas', 'César Soto Grado'),
(4,  1, 4,  1,  20, '2024-08-31 15:00:00', 'finished', 7, 0, 'Estadi Olímpic Lluís Companys', 'Isidro Díaz de Mera'),
(5,  1, 5,  10, 1,  '2024-09-15 14:15:00', 'finished', 1, 4, 'Montilivi', 'Alejandro Muñiz Ruiz'),
(6,  1, 6,  8,  1,  '2024-09-22 16:30:00', 'finished', 1, 5, 'Estadio de la Cerámica', 'Mateo Busquets Ferrer'),
(7,  1, 7,  1,  13, '2024-09-25 19:00:00', 'finished', 1, 0, 'Estadi Olímpic Lluís Companys', 'Pablo González Fuertes'),
(8,  1, 8,  12, 1,  '2024-09-28 19:00:00', 'finished', 4, 2, 'El Sadar', 'Guillermo Cuadra Fernández'),
(9,  1, 9,  16, 1,  '2024-10-06 14:15:00', 'finished', 0, 3, 'Mendizorrotza', 'Miguel Ángel Ortiz Arias'),
(10, 1, 10, 1,  7,  '2024-10-20 19:00:00', 'finished', 5, 1, 'Estadi Olímpic Lluís Companys', 'Ricardo de Burgos Bengoetxea'),
(11, 1, 11, 2,  1,  '2024-10-26 19:00:00', 'finished', 0, 4, 'Santiago Bernabéu', 'José María Sánchez Martínez'),
(12, 1, 12, 1,  18, '2024-11-03 15:15:00', 'finished', 3, 1, 'Estadi Olímpic Lluís Companys', 'Jorge Figueroa Vázquez'),
(13, 1, 13, 5,  1,  '2024-11-10 20:00:00', 'finished', 1, 0, 'Reale Arena', 'Guillermo Cuadra Fernández'),
(14, 1, 14, 11, 1,  '2024-11-23 20:00:00', 'finished', 2, 2, 'Abanca-Balaídos', 'Jesús Gil Manzano'),
(15, 1, 15, 1,  17, '2024-11-30 13:00:00', 'finished', 1, 2, 'Estadi Olímpic Lluís Companys', 'Adrián Cordero Vega'),
(16, 1, 16, 6,  1,  '2024-12-07 15:15:00', 'finished', 2, 2, 'Benito Villamarín', 'Víctor García Verdura'),
(17, 1, 17, 1,  19, '2024-12-15 20:00:00', 'finished', 1, 0, 'Estadi Olímpic Lluís Companys', 'Alejandro Quintero González'),
(18, 1, 18, 1,  3,  '2024-12-21 20:00:00', 'finished', 1, 1, 'Estadi Olímpic Lluís Companys', 'Juan Martínez Munuera'),
(19, 1, 19, 15, 1,  '2024-12-03 18:00:00', 'finished', 1, 5, 'Son Moix', 'José Luis Munuera Montero'),
(20, 1, 20, 13, 1,  '2025-01-18 20:00:00', 'finished', 1, 1, 'Coliseum', 'Alejandro Muñiz Ruiz'),
(21, 1, 21, 1,  9,  '2025-01-26 20:00:00', 'finished', 7, 1, 'Estadi Olímpic Lluís Companys', 'César Soto Grado'),
(22, 1, 22, 1,  16, '2025-02-02 13:00:00', 'finished', 1, 0, 'Estadi Olímpic Lluís Companys', 'Mateo Busquets Ferrer'),
(23, 1, 23, 7,  1,  '2025-02-09 20:00:00', 'finished', 1, 4, 'Ramón Sánchez-Pizjuán', 'Jesús Gil Manzano'),
(24, 1, 24, 1,  14, '2025-02-16 20:00:00', 'finished', 1, 0, 'Estadi Olímpic Lluís Companys', 'Isidro Díaz de Mera'),
(25, 1, 25, 17, 1,  '2025-02-23 20:00:00', 'finished', 0, 2, 'Gran Canaria', 'Ricardo de Burgos Bengoetxea'),
(26, 1, 26, 1,  5,  '2025-03-02 15:15:00', 'finished', 4, 0, 'Estadi Olímpic Lluís Companys', 'José María Sánchez Martínez'),

-- Other Notable 2024/25 Finished Matches
(30, 1, 8,  3,  2,  '2024-09-29 19:00:00', 'finished', 1, 1, 'Cívitas Metropolitano', 'Mateo Busquets Ferrer'),
(31, 1, 1,  15, 2,  '2024-08-18 19:30:00', 'finished', 1, 1, 'Son Moix', 'César Soto Grado'),
(32, 1, 4,  2,  6,  '2024-09-01 19:30:00', 'finished', 2, 0, 'Santiago Bernabéu', 'Javier Alberola Rojas'),
(33, 1, 6,  2,  18, '2024-09-21 19:00:00', 'finished', 4, 1, 'Santiago Bernabéu', 'José Luis Munuera Montero'),
(34, 1, 7,  2,  16, '2024-09-24 19:00:00', 'finished', 3, 2, 'Santiago Bernabéu', 'Alejandro Quintero González'),
(35, 1, 9,  2,  8,  '2024-10-05 19:00:00', 'finished', 2, 0, 'Santiago Bernabéu', 'Guillermo Cuadra Fernández'),
(36, 1, 10, 11, 2,  '2024-10-19 19:00:00', 'finished', 1, 2, 'Abanca-Balaídos', 'Alejandro Muñiz Ruiz'),
(37, 1, 12, 2,  12, '2024-11-09 13:00:00', 'finished', 4, 0, 'Santiago Bernabéu', 'Mario Melero López'),
(38, 1, 13, 19, 2,  '2024-11-24 17:30:00', 'finished', 0, 3, 'Municipal de Butarque', 'Javier Alberola Rojas'),
(39, 1, 14, 2,  13, '2024-12-01 15:15:00', 'finished', 2, 0, 'Santiago Bernabéu', 'Adrián Cordero Vega'),
(40, 1, 15, 4,  2,  '2024-12-04 20:00:00', 'finished', 2, 1, 'San Mamés', 'Jesús Gil Manzano'),

-- Upcoming Scheduled Matches (Season 1)
(45, 1, 27, 3,  1,  '2025-03-16 20:00:00', 'scheduled', NULL, NULL, 'Cívitas Metropolitano', NULL),
(46, 1, 28, 1,  10, '2025-03-30 19:00:00', 'scheduled', NULL, NULL, 'Estadi Olímpic Lluís Companys', NULL),
(47, 1, 29, 1,  6,  '2025-04-06 19:00:00', 'scheduled', NULL, NULL, 'Estadi Olímpic Lluís Companys', NULL),
(48, 1, 30, 19, 1,  '2025-04-13 19:00:00', 'scheduled', NULL, NULL, 'Municipal de Butarque', NULL),
(49, 1, 31, 1,  11, '2025-04-20 19:00:00', 'scheduled', NULL, NULL, 'Estadi Olímpic Lluís Companys', NULL),
(50, 1, 32, 1,  15, '2025-04-23 19:00:00', 'scheduled', NULL, NULL, 'Estadi Olímpic Lluís Companys', NULL),
(51, 1, 33, 20, 1,  '2025-05-04 19:00:00', 'scheduled', NULL, NULL, 'José Zorrilla', NULL),
(52, 1, 35, 1,  2,  '2025-05-11 19:00:00', 'scheduled', NULL, NULL, 'Estadi Olímpic Lluís Companys', NULL),
(53, 1, 38, 4,  1,  '2025-05-25 19:00:00', 'scheduled', NULL, NULL, 'San Mamés', NULL),

-- 2023/24 Campaign Key Matches (Season 2)
(60, 2, 11, 1, 2, '2023-10-28 14:15:00', 'finished', 1, 2, 'Estadi Olímpic Lluís Companys', 'Jesús Gil Manzano'),
(61, 2, 32, 2, 1, '2024-04-21 19:00:00', 'finished', 3, 2, 'Santiago Bernabéu', 'César Soto Grado'),
(62, 2, 15, 1, 3, '2023-12-03 20:00:00', 'finished', 1, 0, 'Estadi Olímpic Lluís Companys', 'José María Sánchez Martínez'),
(63, 2, 29, 3, 1, '2024-03-17 20:00:00', 'finished', 0, 3, 'Cívitas Metropolitano', 'José María Sánchez Martínez'),

-- Historic 2014/15 Treble Matches (Season 6)
(80, 6, 9,  2, 1, '2014-10-25 16:00:00', 'finished', 3, 1, 'Santiago Bernabéu', 'Jesús Gil Manzano'),
(81, 6, 28, 1, 2, '2015-03-22 20:00:00', 'finished', 2, 1, 'Camp Nou', 'Antonio Mateu Lahoz'),
(82, 6, 18, 1, 3, '2015-01-11 20:00:00', 'finished', 3, 1, 'Camp Nou', 'Alberto Undiano Mallenco'),
(83, 6, 37, 3, 1, '2015-05-17 17:00:00', 'finished', 0, 1, 'Vicente Calderón', 'Alberto Undiano Mallenco')
ON DUPLICATE KEY UPDATE 
  home_score=VALUES(home_score), 
  away_score=VALUES(away_score), 
  status=VALUES(status);
