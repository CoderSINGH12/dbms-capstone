# Entity-Relationship (ER) Diagram & Relational Model

This document outlines the conceptual and physical Entity-Relationship model for the **FC Barcelona La Liga DBMS** database (`fcb_laliga_db`).

---

## 1. High-Level Entity Overview

The schema is structured into 12 normalized relational tables designed to support complete La Liga championship tracking with a primary analytical focus on FC Barcelona match performance, player metrics, and standings reconciliation:

1. **`competitions`**: Primary competition metadata (e.g. Primera División / La Liga).
2. **`seasons`**: Specific sporting campaigns (e.g. 2023-24, 2022-23).
3. **`teams`**: Registered football clubs, home stadiums, cities, and crest assets.
4. **`season_teams`**: Many-to-Many associative bridge allocating teams to seasons.
5. **`players`**: Footballers' biographical master records.
6. **`player_season_registrations`**: Squad registrations per club and season with squad shirt numbers.
7. **`matches`**: Fixture schedules, venues, matchdays, final scores, and completion statuses.
8. **`player_match_stats`**: Granular per-player appearance statistics (minutes, goals, assists, cards).
9. **`match_events`**: Chronological in-game occurrences (goals, bookings, substitutions).
10. **`final_standings`**: Historical official league tables used for audit reconciliation.
11. **`app_users`**: Role-based access control (RBAC) users with bcrypt password hashes.
12. **`import_batches`**: Audit trail and provenance logs for data ingestion pipelines.

---

## 2. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    COMPETITIONS ||--o{ SEASONS : "hosts"
    SEASONS ||--o{ SEASON_TEAMS : "includes"
    TEAMS ||--o{ SEASON_TEAMS : "participates_in"
    
    TEAMS ||--o{ PLAYER_SEASON_REGISTRATIONS : "employs"
    SEASONS ||--o{ PLAYER_SEASON_REGISTRATIONS : "registered_for"
    PLAYERS ||--o{ PLAYER_SEASON_REGISTRATIONS : "registers"

    SEASONS ||--o{ MATCHES : "schedules"
    TEAMS ||--o{ MATCHES : "hosts_as_home"
    TEAMS ||--o{ MATCHES : "visits_as_away"

    MATCHES ||--o{ PLAYER_MATCH_STATS : "records"
    PLAYER_SEASON_REGISTRATIONS ||--o{ PLAYER_MATCH_STATS : "participates_as"

    MATCHES ||--o{ MATCH_EVENTS : "contains"
    TEAMS ||--o{ MATCH_EVENTS : "credited_to"
    PLAYER_SEASON_REGISTRATIONS ||--o{ MATCH_EVENTS : "performed_by"

    SEASONS ||--o{ FINAL_STANDINGS : "concludes_with"
    TEAMS ||--o{ FINAL_STANDINGS : "ranked_in"

    SEASONS ||--o{ IMPORT_BATCHES : "tracked_in"

    COMPETITIONS {
        INT id PK
        VARCHAR code UK
        VARCHAR name
        VARCHAR country
    }

    SEASONS {
        INT id PK
        INT competition_id FK
        VARCHAR label UK
        DATE start_date
        DATE end_date
        BOOLEAN is_current
    }

    TEAMS {
        INT id PK
        VARCHAR name UK
        VARCHAR short_name
        VARCHAR tla UK
        VARCHAR stadium_name
        INT stadium_capacity
        VARCHAR city
        BOOLEAN is_barcelona
    }

    SEASON_TEAMS {
        INT season_id PK, FK
        INT team_id PK, FK
    }

    PLAYERS {
        INT id PK
        VARCHAR full_name
        VARCHAR known_as
        VARCHAR position
        VARCHAR nationality
        DATE birth_date
    }

    PLAYER_SEASON_REGISTRATIONS {
        INT id PK
        INT player_id FK
        INT team_id FK
        INT season_id FK
        INT shirt_number
    }

    MATCHES {
        INT id PK
        INT season_id FK
        INT matchday
        INT home_team_id FK
        INT away_team_id FK
        INT home_score
        INT away_score
        DATETIME match_date
        VARCHAR status
    }

    PLAYER_MATCH_STATS {
        INT id PK
        INT match_id FK
        INT registration_id FK
        BOOLEAN started
        INT minutes_played
        INT goals
        INT assists
        INT yellow_cards
        INT red_cards
    }

    MATCH_EVENTS {
        INT id PK
        INT match_id FK
        INT registration_id FK
        INT team_id FK
        VARCHAR event_type
        INT minute
        INT extra_minute
    }

    FINAL_STANDINGS {
        INT id PK
        INT season_id FK
        INT team_id FK
        INT position
        INT played
        INT won
        INT drawn
        INT lost
        INT goals_for
        INT goals_against
        INT points
    }

    APP_USERS {
        INT id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR full_name
        VARCHAR role
    }

    IMPORT_BATCHES {
        INT id PK
        VARCHAR source_name
        INT season_id FK
        INT records_loaded
        VARCHAR status
        DATETIME created_at
    }
```

---

## 3. Relational Cardinalities & Business Rules

1. **One-to-Many (`1:N`) Competition to Seasons**:
   - A single competition (La Liga) encompasses multiple historical and active seasons.
   - Deleting a competition is restricted if active seasons exist (`ON DELETE RESTRICT`).

2. **Many-to-Many (`M:N`) Seasons to Teams (`season_teams`)**:
   - In any season, exactly 20 teams participate in La Liga.
   - Teams move in and out of the top flight via annual promotion and relegation.
   - The composite primary key `(season_id, team_id)` prevents duplicate allocations.

3. **Many-to-Many (`M:N`) Players to Teams via `player_season_registrations`**:
   - Players transfer between clubs or sign season contracts.
   - A player can only be registered once per team and season: `UNIQUE (player_id, team_id, season_id)`.
   - Shirt numbers must be unique within a team in a given season: `UNIQUE (team_id, season_id, shirt_number)`.

4. **Self-Referencing Club Pairings in `matches`**:
   - Each match references two foreign keys to `teams`: `home_team_id` and `away_team_id`.
   - CHECK constraint enforces `home_team_id <> away_team_id`.
   - `UNIQUE (season_id, home_team_id, away_team_id)` prevents accidental double scheduling of identical home fixtures.

5. **Match Eligibility Integrity via Triggers**:
   - Before inserting or updating `player_match_stats`, trigger `trg_validate_player_match_team_insert` enforces that the participating player's registration belongs to either the `home_team_id` or `away_team_id` of that specific fixture.
