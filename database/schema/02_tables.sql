-- ============================================================================
-- 02_tables.sql
-- Define the 12 core tables with constraints, keys, and checks (1NF, 2NF, 3NF)
-- ============================================================================

USE fcb_laliga_db;

-- 1. COMPETITIONS
CREATE TABLE IF NOT EXISTS competitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  country VARCHAR(50) NOT NULL DEFAULT 'Spain',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. SEASONS
CREATE TABLE IF NOT EXISTS seasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  competition_id INT NOT NULL,
  label VARCHAR(20) NOT NULL,
  start_year INT NOT NULL,
  end_year INT NOT NULL,
  status ENUM('completed', 'current') NOT NULL DEFAULT 'completed',
  coverage ENUM('verified', 'partial', 'not_available') NOT NULL DEFAULT 'verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_season_comp_year UNIQUE (competition_id, start_year),
  CONSTRAINT fk_seasons_competition FOREIGN KEY (competition_id) 
    REFERENCES competitions(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. TEAMS
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  short_name VARCHAR(50) NOT NULL,
  tla VARCHAR(5) NULL,
  crest_url VARCHAR(255) NULL,
  city VARCHAR(50) NOT NULL,
  stadium VARCHAR(100) NOT NULL,
  founded_year INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. SEASON_TEAMS (Composite Key)
CREATE TABLE IF NOT EXISTS season_teams (
  season_id INT NOT NULL,
  team_id INT NOT NULL,
  PRIMARY KEY (season_id, team_id),
  CONSTRAINT fk_season_teams_season FOREIGN KEY (season_id) 
    REFERENCES seasons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_season_teams_team FOREIGN KEY (team_id) 
    REFERENCES teams(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. PLAYERS (Identity Only)
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date_of_birth DATE NULL,
  nationality VARCHAR(50) NULL,
  image_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. PLAYER_REGISTRATIONS
CREATE TABLE IF NOT EXISTS player_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  team_id INT NOT NULL,
  season_id INT NOT NULL,
  shirt_number INT NULL,
  position ENUM('Goalkeeper', 'Defender', 'Midfielder', 'Forward') NOT NULL,
  joined_on DATE NULL,
  left_on DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registrations_player FOREIGN KEY (player_id) 
    REFERENCES players(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_registrations_season_team FOREIGN KEY (season_id, team_id) 
    REFERENCES season_teams(season_id, team_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT uq_player_reg UNIQUE (player_id, team_id, season_id, joined_on)
) ENGINE=InnoDB;

-- 7. MATCHES
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  season_id INT NOT NULL,
  matchday INT NOT NULL,
  home_team_id INT NOT NULL,
  away_team_id INT NOT NULL,
  kickoff_utc DATETIME NULL,
  status ENUM('scheduled', 'postponed', 'finished', 'abandoned') NOT NULL DEFAULT 'scheduled',
  home_score INT NULL,
  away_score INT NULL,
  venue VARCHAR(100) NULL,
  referee VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_diff_teams CHECK (home_team_id <> away_team_id),
  CONSTRAINT chk_home_score CHECK (home_score IS NULL OR home_score >= 0),
  CONSTRAINT chk_away_score CHECK (away_score IS NULL OR away_score >= 0),
  CONSTRAINT chk_finished_scores CHECK (
    (status = 'finished' AND home_score IS NOT NULL AND away_score IS NOT NULL) OR
    (status <> 'finished')
  ),
  CONSTRAINT uq_season_fixture UNIQUE (season_id, home_team_id, away_team_id),
  CONSTRAINT fk_matches_season FOREIGN KEY (season_id) 
    REFERENCES seasons(id) ON DELETE CASCADE,
  CONSTRAINT fk_matches_home_team FOREIGN KEY (home_team_id) 
    REFERENCES teams(id) ON DELETE RESTRICT,
  CONSTRAINT fk_matches_away_team FOREIGN KEY (away_team_id) 
    REFERENCES teams(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. PLAYER_MATCH_STATS
CREATE TABLE IF NOT EXISTS player_match_stats (
  match_id INT NOT NULL,
  registration_id INT NOT NULL,
  started TINYINT(1) NOT NULL DEFAULT 1,
  minutes INT NOT NULL DEFAULT 0,
  goals INT NOT NULL DEFAULT 0,
  assists INT NOT NULL DEFAULT 0,
  yellow INT NOT NULL DEFAULT 0,
  red INT NOT NULL DEFAULT 0,
  PRIMARY KEY (match_id, registration_id),
  CONSTRAINT fk_pms_match FOREIGN KEY (match_id) 
    REFERENCES matches(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pms_registration FOREIGN KEY (registration_id) 
    REFERENCES player_registrations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_pms_minutes CHECK (minutes >= 0 AND minutes <= 130),
  CONSTRAINT chk_pms_yellow CHECK (yellow >= 0 AND yellow <= 2),
  CONSTRAINT chk_pms_red CHECK (red >= 0 AND red <= 1),
  CONSTRAINT chk_pms_goals CHECK (goals >= 0),
  CONSTRAINT chk_pms_assists CHECK (assists >= 0)
) ENGINE=InnoDB;

-- 9. PLAYER_SEASON_STATS (For aggregate/historical seasons)
CREATE TABLE IF NOT EXISTS player_season_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL UNIQUE,
  appearances INT NOT NULL DEFAULT 0,
  starts INT NOT NULL DEFAULT 0,
  minutes INT NOT NULL DEFAULT 0,
  goals INT NOT NULL DEFAULT 0,
  assists INT NOT NULL DEFAULT 0,
  yellow INT NOT NULL DEFAULT 0,
  red INT NOT NULL DEFAULT 0,
  is_aggregate TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_pss_registration FOREIGN KEY (registration_id) 
    REFERENCES player_registrations(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_pss_apps CHECK (appearances >= starts),
  CONSTRAINT chk_pss_minutes CHECK (minutes >= 0),
  CONSTRAINT chk_pss_goals CHECK (goals >= 0),
  CONSTRAINT chk_pss_assists CHECK (assists >= 0)
) ENGINE=InnoDB;

-- 10. FINAL_STANDINGS (Official verified table for reconciliation)
CREATE TABLE IF NOT EXISTS final_standings (
  season_id INT NOT NULL,
  team_id INT NOT NULL,
  position INT NOT NULL,
  played INT NOT NULL DEFAULT 0,
  won INT NOT NULL DEFAULT 0,
  drawn INT NOT NULL DEFAULT 0,
  lost INT NOT NULL DEFAULT 0,
  gf INT NOT NULL DEFAULT 0,
  ga INT NOT NULL DEFAULT 0,
  points INT NOT NULL DEFAULT 0,
  PRIMARY KEY (season_id, team_id),
  CONSTRAINT fk_fs_season_team FOREIGN KEY (season_id, team_id) 
    REFERENCES season_teams(season_id, team_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_fs_position CHECK (position >= 1 AND position <= 30),
  CONSTRAINT chk_fs_played CHECK (played = won + drawn + lost),
  CONSTRAINT chk_fs_points CHECK (points = (won * 3) + drawn)
) ENGINE=InnoDB;

-- 11. DATA SOURCES & AUDIT TRAIL
CREATE TABLE IF NOT EXISTS data_sources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(255) NULL,
  license VARCHAR(100) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS import_batches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_id INT NOT NULL,
  season_id INT NULL,
  batch_name VARCHAR(100) NOT NULL,
  status ENUM('started', 'completed', 'failed') NOT NULL DEFAULT 'started',
  records_processed INT NOT NULL DEFAULT 0,
  records_rejected INT NOT NULL DEFAULT 0,
  log_summary TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ib_source FOREIGN KEY (source_id) 
    REFERENCES data_sources(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ib_season FOREIGN KEY (season_id) 
    REFERENCES seasons(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS source_ids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_id INT NOT NULL,
  entity_type ENUM('team', 'player', 'match') NOT NULL,
  external_id VARCHAR(100) NOT NULL,
  internal_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_source_mapping UNIQUE (source_id, entity_type, external_id),
  CONSTRAINT fk_si_source FOREIGN KEY (source_id) 
    REFERENCES data_sources(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 12. USERS (Admin / Authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'Admin User',
  role ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
