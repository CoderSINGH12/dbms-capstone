# Viva Voce & Academic Defense Cheat-Sheet

This guide prepares the presenter for viva voce examinations, project reviews, and academic evaluations for the **FC Barcelona La Liga DBMS** capstone.

---

## 1. Core Architecture & DBMS Rationale

### Q1: Why did you choose a Relational DBMS (MySQL 8+) instead of a NoSQL database like MongoDB?
**Answer:**
> "Football competition data is inherently relational with rigid referential dependencies:
> 1. **ACID Transactions:** Match results and player performance records must be updated atomically. If a player stat violates a constraint, the match result must roll back.
> 2. **Declarative Integrity Constraints:** Relational foreign keys (`ON DELETE RESTRICT/CASCADE`) and MySQL 8+ CHECK constraints guarantee that bad data (e.g. negative minutes or matches where a team plays itself) cannot enter the system.
> 3. **Mathematical Normalization:** Relational decomposition eliminates update anomalies.
> 4. **Complex Analytical Queries:** MySQL 8+ provides robust window functions (`DENSE_RANK()`, `LAG()`, `LEAD()`) and Common Table Expressions (CTEs) that are awkward or slow in document databases."

---

## 2. Normalization & Schema Design

### Q2: How does your schema satisfy Third Normal Form (3NF)?
**Answer:**
> "1. **1NF:** Every attribute holds atomic values. We do not store comma-separated goalscorers or arrays in columns. Every table has a distinct primary key.
> 2. **2NF:** In composite-keyed tables like `player_season_registrations (player_id, team_id, season_id)` and `player_match_stats (match_id, registration_id)`, all non-key attributes depend on the *entire* key. Biographical details (`birth_date`, `nationality`) reside in `players`, preventing partial key dependencies.
> 3. **3NF:** No non-prime attribute determines another non-prime attribute. For example, `matches` records `home_team_id` but does NOT store `stadium_capacity` or `city`. Stadium information resides strictly in `teams`, eliminating transitive dependencies ($\text{match\_id} \to \text{team\_id} \to \text{stadium\_capacity}$)."

### Q3: Why is the league standings table implemented as a SQL View (`v_standings`) rather than a physical table?
**Answer:**
> "Storing standings in a physical table creates a severe update anomaly: whenever an administrator or data feed modifies a match score or voids a fixture, the physical table becomes out-of-sync unless complex, error-prone synchronization routines are written.
> 
> By defining `v_standings` as a dynamic SQL View, standings are computed deterministically on the fly directly from the underlying `matches` rows using `DENSE_RANK()`, `SUM()`, and `CASE WHEN`. This guarantees **100% relational consistency**. For auditing, we maintain an immutable `final_standings` table and provide an automated reconciliation endpoint that checks `v_standings` against the official table."

---

## 3. Triggers & Stored Procedures

### Q4: What triggers did you implement and why?
**Answer:**
> "We implemented two triggers: `trg_validate_player_match_team_insert` and `trg_validate_player_match_team_update`.
> 
> **The Problem:** Foreign keys ensure that `match_id` exists and `registration_id` exists, but standard foreign keys cannot cross-validate that the player registered actually belongs to one of the two clubs playing in that specific match!
> 
> **The Solution:** Our trigger executes before insert/update on `player_match_stats`. It performs a lookup verifying that the player's `team_id` equals either the `home_team_id` or `away_team_id` of the match. If not, it raises `SIGNAL SQLSTATE '45000'` with an explicit eligibility error message."

---

## 4. Performance & Indexing

### Q5: What indexes did you build and how did you verify their efficiency?
**Answer:**
> "We created targeted composite indexes:
> - `idx_matches_season_md (season_id, matchday)`: Optimizes fixture listings and pagination.
> - `idx_matches_home_away (home_team_id, away_team_id)`: Speeds up Head-to-Head analytics queries.
> - `idx_stats_match_reg (match_id, registration_id)`: Accelerates match stats joins.
> - `idx_registrations_season_team (season_id, team_id)`: Optimizes squad roster queries.
> 
> We verified query plans using `EXPLAIN`. As demonstrated in `database/demos/explain_before_after_index.sql`, query execution shifts from a full table scan (`type: ALL`) with high cost to an index ref lookup (`type: ref`) that inspects only the matching rows."

---

## 5. Security & Transactions

### Q6: How is SQL Injection prevented?
**Answer:**
> "We use 100% parameterized prepared statements via the `mysql2/promise` pool. Input variables are transmitted separately from the SQL statement structure using `?` placeholders. The database engine compiles the query template first, treating parameters strictly as literals, making SQL injection impossible."

### Q7: Explain how ACID properties are guaranteed in your application.
**Answer:**
> "When an administrator records a completed match result with player statistics:
> - **Atomicity:** Wrapped in a transaction (`connection.beginTransaction()`, `connection.commit()`, `connection.rollback()`). If any player stat fails validation or triggers an error, all changes revert.
> - **Consistency:** Relational foreign keys and CHECK constraints prevent corrupt data.
> - **Isolation:** InnoDB uses row-level locking and repeatable read isolation.
> - **Durability:** Committed transactions are written to InnoDB write-ahead redo logs (WAL)."
