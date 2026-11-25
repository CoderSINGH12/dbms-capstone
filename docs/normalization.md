# Database Normalization & Relational Theory

This document provides the formal mathematical and relational theory justification for the schema design of **FC Barcelona La Liga DBMS** (`fcb_laliga_db`), proving that all relation schemas satisfy **Third Normal Form (3NF)**.

---

## 1. Functional Dependencies (FDs) Analysis

Let the relational database schema be defined over universal attribute sets. Below are the minimal covers of functional dependencies observed across the primary relations:

### 1.1 Teams Relation ($R_{\text{teams}}$)
- Primary Key: $\{\text{id}\}$
- Alternate Key: $\{\text{name}\}$, $\{\text{tla}\}$
- Functional Dependencies:
  $$\text{id} \to \{\text{name}, \text{short\_name}, \text{tla}, \text{crest\_url}, \text{stadium\_name}, \text{stadium\_capacity}, \text{city}, \text{founded\_year}, \text{website}, \text{is\_barcelona}\}$$
  $$\text{name} \to \{\text{id}, \text{short\_name}, \dots\}$$

### 1.2 Matches Relation ($R_{\text{matches}}$)
- Primary Key: $\{\text{id}\}$
- Alternate Key: $\{\text{season\_id}, \text{home\_team\_id}, \text{away\_team\_id}\}$
- Functional Dependencies:
  $$\text{id} \to \{\text{season\_id}, \text{matchday}, \text{home\_team\_id}, \text{away\_team\_id}, \text{home\_score}, \text{away\_score}, \text{match\_date}, \text{stadium\_name}, \text{referee}, \text{status}\}$$
  $$\{\text{season\_id}, \text{home\_team\_id}, \text{away\_team\_id}\} \to \{\text{id}, \text{matchday}, \text{home\_score}, \dots\}$$

### 1.3 Players Relation ($R_{\text{players}}$)
- Primary Key: $\{\text{id}\}$
- Functional Dependencies:
  $$\text{id} \to \{\text{full\_name}, \text{known\_as}, \text{position}, \text{nationality}, \text{birth\_date}\}$$

### 1.4 Player Registrations Relation ($R_{\text{registrations}}$)
- Primary Key: $\{\text{id}\}$
- Alternate Key: $\{\text{player\_id}, \text{team\_id}, \text{season\_id}\}$
- Functional Dependencies:
  $$\text{id} \to \{\text{player\_id}, \text{team\_id}, \text{season\_id}, \text{shirt\_number}, \text{registered\_at}\}$$
  $$\{\text{player\_id}, \text{team\_id}, \text{season\_id}\} \to \{\text{id}, \text{shirt\_number}, \text{registered\_at}\}$$

### 1.5 Player Match Stats Relation ($R_{\text{stats}}$)
- Primary Key: $\{\text{id}\}$
- Alternate Key: $\{\text{match\_id}, \text{registration\_id}\}$
- Functional Dependencies:
  $$\text{id} \to \{\text{match\_id}, \text{registration\_id}, \text{started}, \text{minutes\_played}, \text{goals}, \text{assists}, \text{yellow\_cards}, \text{red\_cards}, \text{shots}, \text{shots\_on\_target}\}$$
  $$\{\text{match\_id}, \text{registration\_id}\} \to \{\text{id}, \text{started}, \text{minutes\_played}, \dots\}$$

---

## 2. Verification of Normal Forms

### 2.1 First Normal Form (1NF)
**Definition:** A relation $R$ is in 1NF if and only if the domain of each attribute contains only atomic (indivisible) values, and there are no repeating groups or arrays.

- **Atomicity:** All attributes contain single scalar values. For instance, goals scored in a match are NOT stored as a comma-separated list of player IDs (e.g., `'Lewandowski, Pedri'`) inside `matches`. Instead, each event is stored as an atomic row in `match_events`, and each aggregate total is an integer in `player_match_stats`.
- **No Multi-Valued Attributes:** A player who holds dual nationalities or multiple squad numbers across seasons is represented through separate records in `player_season_registrations`.
- **Uniqueness:** Every relation possesses an explicit primary key, ensuring each tuple is uniquely identifiable.

$$\therefore \text{All 12 tables satisfy 1NF.}$$

---

### 2.2 Second Normal Form (2NF)
**Definition:** A relation $R$ is in 2NF if and only if it is in 1NF and every non-prime attribute is fully functionally dependent on every candidate key (i.e., no partial key dependencies exist).

- **Evaluation of Composite Candidate Keys:**
  In `season_teams`, the candidate key is composite: $\{\text{season\_id}, \text{team\_id}\}$. The only non-key attribute is `created_at`, which depends on the entire pair $(\text{season\_id}, \text{team\_id})$.
  In `player_season_registrations`, the composite candidate key is $\{\text{player\_id}, \text{team\_id}, \text{season\_id}\}$. Attributes such as `shirt_number` and `registered_at` depend on the player's specific contract with that club for that season. Crucially, the player's biographical details (`full_name`, `birth_date`) are **not** stored here; storing them here would introduce a partial dependency:
  $$\text{player\_id} \to \text{full\_name} \quad (\text{Strict subset of Candidate Key})$$
  By separating player biography into $R_{\text{players}}$, all partial dependencies are eliminated.
  Similarly, in `player_match_stats`, the candidate key is $\{\text{match\_id}, \text{registration\_id}\}$. Match metadata (e.g. `match_date`, `home_team_id`) is not repeated in this table.

$$\therefore \text{All relations satisfy 2NF.}$$

---

### 2.3 Third Normal Form (3NF)
**Definition:** A relation $R$ is in 3NF if and only if it is in 2NF and whenever a non-trivial functional dependency $X \to Y$ holds in $R$, either:
1. $X$ is a superkey of $R$, OR
2. $Y$ is a prime attribute of $R$ (part of a candidate key).
*(Equivalently, no non-prime attribute is transitively dependent on any candidate key).*

- **Elimination of Transitive Dependencies:**
  Consider a hypothetical un-normalized `matches` table containing stadium information:
  $$\text{id} \to \text{home\_team\_id} \quad \text{and} \quad \text{home\_team\_id} \to \text{stadium\_capacity}$$
  This would constitute a transitive dependency: $\text{id} \to \text{stadium\_capacity}$ via $\text{home\_team\_id}$.
  In our normalized schema, `stadium_capacity` resides exclusively in $R_{\text{teams}}$. $R_{\text{matches}}$ stores only foreign keys `home_team_id` and `away_team_id`.
  Similarly, `player_match_stats` references `registration_id`. It does not store `player_name` or `position`, preventing:
  $$\text{id} \to \text{registration\_id} \to \text{player\_id} \to \text{position}$$

$$\therefore \text{All relations satisfy 3NF.}$$

---

## 3. The Standings Dilemma: Stored Table vs. Dynamic VIEW

A fundamental architectural decision in football relational modeling is how to handle the league table standings:

```
Should "standings" (played, won, drawn, lost, points, goal difference) be stored in a physical table or computed dynamically?
```

### 3.1 The Redundancy & Anomaly Argument
If standings were stored in a physical table updated after every match:
- Every entry $(P, W, D, L, GF, GA, PTS)$ is a derived attribute functionally determined by the set of all finished matches:
  $$\{M \in \text{matches} \mid M.\text{status} = \text{'finished'}\} \to \text{Standings}$$
- **Update Anomalies:** If an administrator updates a score in `matches` (e.g. corrects a typo from 2-1 to 1-1), the physical standings table becomes instantly inconsistent unless updated inside an error-prone synchronization script.
- **Deletion Anomalies:** Deleting a voided match requires rolling back the specific points and goal differentials from both teams.

### 3.2 The Relational Solution: SQL View `v_standings`
In `fcb_laliga_db`, live league standings are defined as a standard SQL View (`v_standings`):
- Standings are computed deterministically on query execution using `SUM()`, `CASE WHEN`, and window function `DENSE_RANK() OVER (PARTITION BY season_id ORDER BY points DESC, gd DESC, gf DESC)`.
- Guarantees **Zero Inconsistency**: It is mathematically impossible for `v_standings` to diverge from the underlying match records.

### 3.3 The Audit Reconciliation Pattern
To address historical archives and academic verification, `final_standings` exists as an immutable, audited snapshot table. The application features an automated reconciliation pipeline:
$$\text{Reconciliation Error} = \text{Live } v\_standings - \text{Official } final\_standings$$
Any discrepancy immediately flags missing fixtures or score discrepancies in the database control center.
