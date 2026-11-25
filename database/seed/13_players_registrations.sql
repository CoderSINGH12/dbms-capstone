-- ============================================================================
-- 13_players_registrations.sql
-- Seed players (identity) and player_registrations (squads per season)
-- ============================================================================

USE fcb_laliga_db;

-- 1. PLAYERS (Identity)
INSERT INTO players (id, name, date_of_birth, nationality, image_url) VALUES
-- Modern Barça Stars (2024/25, 2023/24, 2022/23)
(1,  'Lamine Yamal',             '2007-07-13', 'Spain',       NULL),
(2,  'Robert Lewandowski',       '1988-08-21', 'Poland',      NULL),
(3,  'Raphinha',                 '1996-12-14', 'Brazil',      NULL),
(4,  'Pedri (Pedro González)',   '2002-11-25', 'Spain',       NULL),
(5,  'Gavi (Pablo Páez Gavira)', '2004-08-05', 'Spain',       NULL),
(6,  'Dani Olmo',                '1998-05-07', 'Spain',       NULL),
(7,  'Frenkie de Jong',          '1997-05-12', 'Netherlands', NULL),
(8,  'Marc Casadó',              '2003-09-14', 'Spain',       NULL),
(9,  'Fermín López',             '2003-05-11', 'Spain',       NULL),
(10, 'Ferran Torres',            '2000-02-29', 'Spain',       NULL),
(11, 'Pau Cubarsí',              '2007-01-22', 'Spain',       NULL),
(12, 'Jules Koundé',             '1998-11-12', 'France',      NULL),
(13, 'Alejandro Balde',          '2003-10-18', 'Spain',       NULL),
(14, 'Iñigo Martínez',           '1991-05-17', 'Spain',       NULL),
(15, 'Marc-André ter Stegen',    '1992-04-30', 'Germany',     NULL),
(16, 'Iñaki Peña',               '1999-03-02', 'Spain',       NULL),
(17, 'Ronald Araújo',            '1999-03-07', 'Uruguay',     NULL),
(18, 'Wojciech Szczęsny',        '1990-04-18', 'Poland',      NULL),
(19, 'Andreas Christensen',      '1996-04-10', 'Denmark',     NULL),
(20, 'Eric García',              '2001-01-09', 'Spain',       NULL),

-- Historic Barça Legends (2014/15 Treble Era)
(30, 'Lionel Messi',             '1987-06-24', 'Argentina',   NULL),
(31, 'Luis Suárez',              '1987-01-24', 'Uruguay',     NULL),
(32, 'Neymar Jr',                '1992-02-05', 'Brazil',      NULL),
(33, 'Andrés Iniesta',           '1984-05-11', 'Spain',       NULL),
(34, 'Xavi Hernández',           '1980-01-25', 'Spain',       NULL),
(35, 'Sergio Busquets',          '1988-07-16', 'Spain',       NULL),
(36, 'Gerard Piqué',             '1987-02-02', 'Spain',       NULL),
(37, 'Javier Mascherano',        '1984-06-08', 'Argentina',   NULL),
(38, 'Dani Alves',               '1983-05-06', 'Brazil',      NULL),
(39, 'Jordi Alba',               '1989-03-21', 'Spain',       NULL),
(40, 'Ivan Rakitić',             '1988-03-10', 'Croatia',     NULL),
(41, 'Claudio Bravo',            '1983-04-13', 'Chile',       NULL),

-- Key Rival Stars (for analytics, comparisons & head-to-head)
(50, 'Vinícius Júnior',          '2000-07-12', 'Brazil',      NULL),
(51, 'Kylian Mbappé',            '1998-12-20', 'France',      NULL),
(52, 'Jude Bellingham',          '2003-06-29', 'England',     NULL),
(53, 'Antoine Griezmann',        '1991-03-21', 'France',      NULL),
(54, 'Nico Williams',            '2002-07-12', 'Spain',       NULL),
(55, 'Iago Aspas',               '1987-08-01', 'Spain',       NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name), date_of_birth=VALUES(date_of_birth), nationality=VALUES(nationality), image_url=VALUES(image_url);

-- 2. REGISTRATIONS FOR 2024/25 (Season 1 - FC Barcelona team_id = 1)
INSERT INTO player_registrations (id, player_id, team_id, season_id, shirt_number, position, joined_on) VALUES
(1,  1,  1, 1, 19, 'Forward',    '2023-07-01'),
(2,  2,  1, 1, 9,  'Forward',    '2022-07-16'),
(3,  3,  1, 1, 11, 'Forward',    '2022-07-15'),
(4,  4,  1, 1, 8,  'Midfielder', '2020-09-02'),
(5,  5,  1, 1, 6,  'Midfielder', '2021-07-01'),
(6,  6,  1, 1, 20, 'Midfielder', '2024-08-09'),
(7,  7,  1, 1, 21, 'Midfielder', '2019-07-01'),
(8,  8,  1, 1, 17, 'Midfielder', '2023-07-01'),
(9,  9,  1, 1, 16, 'Midfielder', '2023-07-01'),
(10, 10, 1, 1, 7,  'Forward',    '2022-01-01'),
(11, 11, 1, 1, 2,  'Defender',   '2024-01-01'),
(12, 12, 1, 1, 23, 'Defender',   '2022-07-28'),
(13, 13, 1, 1, 3,  'Defender',   '2022-07-01'),
(14, 14, 1, 1, 5,  'Defender',   '2023-07-05'),
(15, 15, 1, 1, 1,  'Goalkeeper', '2014-07-01'),
(16, 16, 1, 1, 13, 'Goalkeeper', '2018-07-01'),
(17, 17, 1, 1, 4,  'Defender',   '2020-10-05'),
(18, 18, 1, 1, 25, 'Goalkeeper', '2024-10-02'),

-- Rival Registrations 2024/25
(21, 50, 2, 1, 7,  'Forward',    '2018-07-12'), -- Vinícius (Real Madrid)
(22, 51, 2, 1, 9,  'Forward',    '2024-07-01'), -- Mbappé (Real Madrid)
(23, 52, 2, 1, 5,  'Midfielder', '2023-07-01'), -- Bellingham (Real Madrid)
(24, 53, 3, 1, 7,  'Forward',    '2022-07-01'), -- Griezmann (Atlético)
(25, 54, 4, 1, 10, 'Forward',    '2021-07-01'), -- Nico Williams (Athletic)
(26, 55, 11,1, 10, 'Forward',    '2015-07-01'), -- Iago Aspas (Celta Vigo)

-- 2023/24 Registrations (Season 2 - Barcelona)
(31, 1,  1, 2, 27, 'Forward',    '2023-07-01'),
(32, 2,  1, 2, 9,  'Forward',    '2022-07-16'),
(33, 3,  1, 2, 11, 'Forward',    '2022-07-15'),
(34, 4,  1, 2, 8,  'Midfielder', '2020-09-02'),
(35, 5,  1, 2, 6,  'Midfielder', '2021-07-01'),
(36, 7,  1, 2, 21, 'Midfielder', '2019-07-01'),
(37, 9,  1, 2, 32, 'Midfielder', '2023-07-01'),
(38, 10, 1, 2, 7,  'Forward',    '2022-01-01'),
(39, 12, 1, 2, 23, 'Defender',   '2022-07-28'),
(40, 15, 1, 2, 1,  'Goalkeeper', '2014-07-01'),

-- 2014/15 Registrations (Season 6 - Barcelona Treble)
(61, 30, 1, 6, 10, 'Forward',    '2004-10-16'), -- Messi
(62, 31, 1, 6, 9,  'Forward',    '2014-07-11'), -- Suárez
(63, 32, 1, 6, 11, 'Forward',    '2013-06-03'), -- Neymar
(64, 33, 1, 6, 8,  'Midfielder', '2002-10-29'), -- Iniesta
(65, 34, 1, 6, 6,  'Midfielder', '1998-08-18'), -- Xavi
(66, 35, 1, 6, 5,  'Midfielder', '2008-09-13'), -- Busquets
(67, 36, 1, 6, 3,  'Defender',   '2008-08-13'), -- Piqué
(68, 37, 1, 6, 14, 'Defender',   '2010-08-30'), -- Mascherano
(69, 38, 1, 6, 22, 'Defender',   '2008-07-02'), -- Dani Alves
(70, 39, 1, 6, 18, 'Defender',   '2012-07-05'), -- Jordi Alba
(71, 40, 1, 6, 4,  'Midfielder', '2014-07-01'), -- Rakitić
(72, 41, 1, 6, 13, 'Goalkeeper', '2014-07-01')  -- Bravo
ON DUPLICATE KEY UPDATE shirt_number=VALUES(shirt_number), position=VALUES(position);
