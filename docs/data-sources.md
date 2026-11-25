# Data Sources, Ingestion Pipelines & Provenance

This document outlines the data sources, ingestion pipelines, licensing, and scoping boundaries for **FC Barcelona La Liga DBMS**.

---

## 1. Data Sources Portfolio

The platform synthesizes data across three complementary tiers:

### 1.1 `football-data.org` REST API
- **Domain:** Official competition structures, match fixtures, kickoff dates, final scorelines, and official league standings.
- **Role:** Supplies current-season fixture schedules, real-time match statuses (`SCHEDULED`, `FINISHED`), and club metadata (stadiums, founded years, crest assets).
- **Format:** JSON via HTTP REST API.

### 1.2 StatsBomb Open Data
- **Domain:** Detailed event telemetry and match performance records.
- **Role:** Supplies granular match-level metrics for FC Barcelona fixtures: starting lineups, minutes played, goals, assists, disciplinary cards, shot statistics, and player positioning.
- **Format:** GitHub open JSON datasets (`statsbomb/open-data`).

### 1.3 Curated CSV Match Archives
- **Domain:** Historical Spanish Primera División results (e.g. 2020-21 through 2022-23).
- **Role:** Ensures that prior campaigns have complete 38-matchday records across all 20 competing clubs, enabling multi-season cross-comparison and standings verification without hitting external rate limits.
- **Format:** UTF-8 delimited CSV files parsed with standard stream readers.

---

## 2. Scoping Boundaries & Design Decisions

### 2.1 Why Exclusively La Liga (Primera División)?
The project deliberately restricts scope to the Spanish domestic league and omits the UEFA Champions League, Copa del Rey, or Supercopa de España. This is a deliberate **relational modeling decision**:

1. **Deterministic Fixture Invariant:**
   In a single round-robin domestic league with 20 clubs, each pair of teams $(A, B)$ plays exactly twice per season (once at $A$'s home stadium, once at $B$'s home stadium). This allows the database to enforce a strict relational constraint:
   ```sql
   UNIQUE (season_id, home_team_id, away_team_id)
   ```
   If cup competitions and European matches were mixed into the same relation, this constraint would fail because two teams can meet in both the domestic league, a two-legged cup semi-final, and a Champions League knockout tie within the same sporting year.

2. **Equitable Standings Computations:**
   League points ($3 \text{ for win}, 1 \text{ for draw}, 0 \text{ for loss}$) apply strictly to league fixtures. Mixing knockout cup games would corrupt the dynamic standings view (`v_standings`).

### 2.2 Coverage Granularity: FC Barcelona vs. League-Wide
- **League-Wide Scope:** All 20 clubs per season have full fixture records, home/away scores, and official standings.
- **FC Barcelona Deep Granularity:** FC Barcelona fixtures include full player-level match performance breakdowns (`player_match_stats` and `match_events`), enabling Pichichi races, assist charts, card records, and player progression tracking.

---

## 3. Data Ingestion Pipeline (ETL Architecture)

The automated ingestion process is structured into four deterministic stages:

```
[External Source: API / CSV / StatsBomb]
               │
               ▼
        1. Extract & Fetch
               │
               ▼
     2. Normalize & Map (normalize.js)
        - Map club names to canonical IDs
        - Convert dates to ISO 8601 UTC
        - Translate status codes
               │
               ▼
     3. Schema Validation (validate.js)
        - Validate against Zod schemas
        - Ensure numeric scores are non-negative
        - Check team IDs exist
               │
               ▼
     4. Atomic Database Load (load.js)
        - BEGIN TRANSACTION
        - UPSERT matches & registrations
        - Check trigger constraints
        - COMMIT TRANSACTION
               │
               ▼
     5. Audit & Reconcile (reconcile.js)
        - Compute live v_standings
        - Compare against final_standings
        - Write log to import_batches
```

---

## 4. Licensing & Attribution

- **StatsBomb:** Data provided under the StatsBomb Open Data Public Licence. Intended for non-commercial, educational, and academic research purposes.
- **football-data.org:** Free tier access adhering to rate limits and API terms of service.
- **FC Barcelona Assets:** Crests, club names, and player likenesses are intellectual property of Futbol Club Barcelona and LaLiga Nacional de Fútbol Profesional, utilized here under fair use for educational academic capstone demonstration.
