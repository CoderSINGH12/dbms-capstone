# Data Dictionary — FC Barcelona La Liga DBMS

This document details the schema definitions, column constraints, data types, and referential actions for all 12 tables in `fcb_laliga_db`.

---

## 1. `competitions`
Represents official governing competitions.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique identifier. |
| `code` | `VARCHAR(10)` | No | UK | None | Unique competition code (e.g. `PD` for Primera División). |
| `name` | `VARCHAR(100)` | No | | None | Full legal name of competition. |
| `country` | `VARCHAR(60)` | No | | None | Host nation (e.g. `Spain`). |
| `created_at` | `DATETIME` | No | | `CURRENT_TIMESTAMP` | Row creation timestamp. |

---

## 2. `seasons`
Tracks specific football seasons within competitions.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique identifier. |
| `competition_id` | `INT` | No | FK | None | References `competitions(id)`. |
| `label` | `VARCHAR(20)` | No | UK | None | Season label (e.g. `2023-24`, `2022-23`). |
| `start_date` | `DATE` | No | | None | Official campaign start date. |
| `end_date` | `DATE` | No | | None | Official campaign conclusion date. `CHECK (end_date >= start_date)`. |
| `is_current` | `TINYINT(1)` | No | | `0` | Boolean flag (1 = active season, 0 = past). |
| `created_at` | `DATETIME` | No | | `CURRENT_TIMESTAMP` | Row creation timestamp. |

---

## 3. `teams`
Master catalogue of registered football clubs.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique identifier. |
| `name` | `VARCHAR(100)` | No | UK | None | Full club name (e.g. `FC Barcelona`). |
| `short_name` | `VARCHAR(50)` | No | | None | Compact display name (e.g. `Barça`). |
| `tla` | `VARCHAR(5)` | Yes | UK | None | Three-letter acronym (e.g. `FCB`, `RMA`). |
| `crest_url` | `VARCHAR(255)` | Yes | | None | URL or asset path to club emblem SVG/PNG. |
| `stadium_name` | `VARCHAR(100)` | Yes | | None | Home venue name (e.g. `Camp Nou`). |
| `stadium_capacity` | `INT` | Yes | | None | Spectator capacity. `CHECK (stadium_capacity > 0)`. |
| `city` | `VARCHAR(60)` | Yes | | None | Home city. |
| `founded_year` | `INT` | Yes | | None | Year established. `CHECK (founded_year BETWEEN 1800 AND 2100)`. |
| `website` | `VARCHAR(255)` | Yes | | None | Official club web portal. |
| `is_barcelona` | `TINYINT(1)` | No | | `0` | Flag denoting primary analytics focus club. |

---

## 4. `season_teams`
Associative bridge linking clubs to seasons.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `season_id` | `INT` | No | PK, FK | None | References `seasons(id) ON DELETE CASCADE`. |
| `team_id` | `INT` | No | PK, FK | None | References `teams(id) ON DELETE RESTRICT`. |
| `created_at` | `DATETIME` | No | | `CURRENT_TIMESTAMP` | Row creation timestamp. |

---

## 5. `players`
Master entity representing footballers.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique identifier. |
| `full_name` | `VARCHAR(100)` | No | | None | Full passport/legal name. |
| `known_as` | `VARCHAR(60)` | Yes | | None | Common/pitch name (e.g. `Pedri`, `Gavi`). |
| `position` | `ENUM(...)` | No | | None | Allowed: `'Goalkeeper'`, `'Defender'`, `'Midfielder'`, `'Forward'`. |
| `nationality` | `VARCHAR(60)` | Yes | | None | Country of football nationality. |
| `birth_date` | `DATE` | Yes | | None | Date of birth. |
| `created_at` | `DATETIME` | No | | `CURRENT_TIMESTAMP` | Row creation timestamp. |

---

## 6. `player_season_registrations`
Squad registration contracts allocating players to clubs for specific seasons.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique registration token. |
| `player_id` | `INT` | No | FK | None | References `players(id) ON DELETE RESTRICT`. |
| `team_id` | `INT` | No | FK | None | References `teams(id) ON DELETE RESTRICT`. |
| `season_id` | `INT` | No | FK | None | References `seasons(id) ON DELETE CASCADE`. |
| `shirt_number` | `INT` | Yes | | None | Squad number (1–99). `CHECK (shirt_number BETWEEN 1 AND 99)`. |
| `registered_at`| `DATE` | Yes | | None | Official contract registration date. |

**Composite Constraints:**
- `UNIQUE (player_id, team_id, season_id)`: A player can only have one active contract per team per season.
- `UNIQUE (team_id, season_id, shirt_number)`: A shirt number cannot be shared by two players on the same club in the same season.

---

## 7. `matches`
Scheduled and completed La Liga fixtures.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique match identifier. |
| `season_id` | `INT` | No | FK | None | References `seasons(id) ON DELETE CASCADE`. |
| `matchday` | `INT` | No | | None | Matchday round (1–38). `CHECK (matchday BETWEEN 1 AND 38)`. |
| `home_team_id`| `INT` | No | FK | None | References `teams(id) ON DELETE RESTRICT`. |
| `away_team_id`| `INT` | No | FK | None | References `teams(id) ON DELETE RESTRICT`. |
| `home_score` | `INT` | Yes | | None | Goals scored by home team. `CHECK (home_score >= 0)`. |
| `away_score` | `INT` | Yes | | None | Goals scored by away team. `CHECK (away_score >= 0)`. |
| `match_date` | `DATETIME` | No | | None | Kickoff date and time. |
| `stadium_name`| `VARCHAR(100)` | Yes | | None | Venue where match was held. |
| `referee` | `VARCHAR(100)` | Yes | | None | Name of the lead match official. |
| `status` | `ENUM(...)` | No | | `'scheduled'` | Allowed: `'scheduled'`, `'in_play'`, `'finished'`, `'postponed'`. |

**Integrity Checks:**
- `CHECK (home_team_id <> away_team_id)`: A team cannot play against itself.
- `UNIQUE (season_id, home_team_id, away_team_id)`: A fixture between two teams at a specific home venue can only happen once per season.

---

## 8. `player_match_stats`
Granular performance records per player per appearance.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique record ID. |
| `match_id` | `INT` | No | FK | None | References `matches(id) ON DELETE CASCADE`. |
| `registration_id`| `INT`| No | FK | None | References `player_season_registrations(id) ON DELETE RESTRICT`. |
| `started` | `TINYINT(1)` | No | | `0` | Started in starting eleven (1) or substitute (0). |
| `minutes_played`| `INT` | No | | `0` | Playing time. `CHECK (minutes_played BETWEEN 0 AND 130)`. |
| `goals` | `INT` | No | | `0` | Outfield goals. `CHECK (goals >= 0)`. |
| `assists` | `INT` | No | | `0` | Assists awarded. `CHECK (assists >= 0)`. |
| `yellow_cards` | `INT` | No | | `0` | Caution cards (0, 1, or 2). `CHECK (yellow_cards BETWEEN 0 AND 2)`. |
| `red_cards` | `INT` | No | | `0` | Dismissals (0 or 1). `CHECK (red_cards BETWEEN 0 AND 1)`. |
| `shots` | `INT` | Yes | | `0` | Total shots attempted. `CHECK (shots >= 0)`. |
| `shots_on_target`| `INT`| Yes | | `0` | Shots on target. `CHECK (shots_on_target <= shots)`. |

**Composite Constraints & Triggers:**
- `UNIQUE (match_id, registration_id)`: A player can only have one stats entry per match.
- Trigger `trg_validate_player_match_team_insert` enforces player eligibility before insertion.

---

## 9. `match_events`
Chronological in-game occurrences.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Unique event ID. |
| `match_id` | `INT` | No | FK | None | References `matches(id) ON DELETE CASCADE`. |
| `registration_id`| `INT`| Yes| FK | None | Player involved; references `player_season_registrations(id)`. |
| `team_id` | `INT` | No | FK | None | References `teams(id) ON DELETE RESTRICT`. |
| `event_type` | `ENUM(...)` | No | | None | Allowed: `'goal'`, `'penalty_goal'`, `'own_goal'`, `'yellow_card'`, `'red_card'`, `'substitution'`. |
| `minute` | `INT` | No | | None | Standard regulation minute (1–120). |
| `extra_minute`| `INT` | Yes | | `0` | Stoppage time added minute. |

---

## 10. `final_standings`
Official concluded league table snapshots for audit reconciliation.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Record ID. |
| `season_id` | `INT` | No | FK | None | References `seasons(id) ON DELETE CASCADE`. |
| `team_id` | `INT` | No | FK | None | References `teams(id) ON DELETE RESTRICT`. |
| `position` | `INT` | No | | None | Final rank (1–20). `CHECK (position BETWEEN 1 AND 20)`. |
| `played` | `INT` | No | | `38` | Total matches. `CHECK (played BETWEEN 0 AND 38)`. |
| `won` | `INT` | No | | `0` | Total wins. |
| `drawn` | `INT` | No | | `0` | Total draws. |
| `lost` | `INT` | No | | `0` | Total defeats. |
| `goals_for` | `INT` | No | | `0` | Total goals scored. |
| `goals_against`| `INT` | No | | `0` | Total goals conceded. |
| `points` | `INT` | No | | `0` | Official total points. `CHECK (points = won * 3 + drawn)`. |

**Unique Constraint:**
- `UNIQUE (season_id, team_id)`: Exactly one official standing record per team per season.
- `UNIQUE (season_id, position)`: Exactly one club per rank position per season.

---

## 11. `app_users`
Security principal store for administrative authentication.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | User ID. |
| `email` | `VARCHAR(100)` | No | UK | None | Unique login email. |
| `password_hash`| `VARCHAR(255)`| No | | None | Bcrypt password hash (10 salt rounds). |
| `full_name` | `VARCHAR(100)` | No | | None | Display name. |
| `role` | `ENUM(...)` | No | | `'analyst'` | Allowed: `'admin'`, `'analyst'`. |

---

## 12. `import_batches`
Provenance and auditing trail for data ingestion operations.

| Column | Type | Nullable | Key | Default | Description & Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `INT` | No | PK | `AUTO_INCREMENT` | Batch ID. |
| `source_name` | `VARCHAR(50)` | No | | None | Source (e.g. `football-data.org`, `StatsBomb`). |
| `season_id` | `INT` | Yes | FK | None | Associated season ID. |
| `records_loaded`| `INT` | No | | `0` | Count of rows inserted or updated. |
| `status` | `ENUM(...)` | No | | `'pending'` | Allowed: `'pending'`, `'success'`, `'partial'`, `'failed'`. |
| `created_at` | `DATETIME` | No | | `CURRENT_TIMESTAMP` | Ingestion timestamp. |
