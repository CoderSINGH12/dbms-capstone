# FC Barcelona La Liga Match Analytics & Relational DBMS Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Database: MySQL 8+](https://img.shields.io/badge/Database-MySQL%208%2B-orange.svg)](https://www.mysql.com/)
[![Backend: Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](https://expressjs.com/)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blueviolet.svg)](https://vitejs.dev/)

A full-stack sports analytics and relational database management platform. The application models the Spanish Primera División (La Liga) with an analytical emphasis on **FC Barcelona**, featuring a 3NF normalized schema, dynamic SQL views, ACID transaction pipelines, integrity triggers, 20 advanced SQL reports, and an administrative control center.

---

## 1. Architecture & Monorepo Structure

```
fcb-laliga-dbms/
├── database/                    # Relational Database Engineering
│   ├── schema/                  # 01_database, 02_tables, 03_indexes, 04_views, 05_triggers
│   ├── seed/                    # 10_competitions .. 17_admin_user (deterministic seeds)
│   ├── reports/                 # 09_all_20_reports_suite.sql (20 advanced DBMS reports)
│   ├── demos/                   # transaction_rollback.sql, constraint_violations.sql, explain_plans.sql
│   ├── setup_user.sql           # MySQL Workbench user creation script (fcb_user@localhost)
│   ├── reset.bat / reset.sh     # Automated database re-initialization scripts
│
├── server/                      # Express.js REST API
│   ├── src/
│   │   ├── config/              # db.js (mysql2 connection pool), env.js
│   │   ├── controllers/         # seasons, teams, players, matches, standings, analytics, auth, admin
│   │   ├── services/            # Parameterized SQL services, atomic transactions, audit reconciliation
│   │   ├── middleware/          # auth (JWT), errorHandler (MySQL error codes), validate (Zod)
│   │   ├── validators/          # Zod input schemas for teams, players, matches, stats
│   │   ├── routes/              # Modular Express routers
│   ├── import/                  # ETL ingestion pipeline (football-data.org, StatsBomb, CSV)
│   ├── tests/                   # Native Node.js test runner integration test suite
│
├── client/                      # React 18 + Redux Toolkit + Tailwind CSS + Vite
│   ├── src/
│   │   ├── pages/               # Dashboard, Matches, MatchDetail, Players, PlayerProfile,
│   │   │                        # LaLigaHub, TeamDetail, Analytics, Compare, Favorites, Login
│   │   │   └── admin/           # AdminLayout, AdminHome, TeamsAdmin, PlayersAdmin,
│   │   │                        # SeasonsAdmin, MatchesAdmin, StatsAdmin, StandingsAdmin, ImportAdmin
│   │   ├── components/          # StandingsTable, MatchCard, PlayerCard, TeamCard, DataTable,
│   │   │                        # SeasonSelector, Loader, ErrorBanner, Notification, charts, forms
│   │   ├── redux/               # seasonSlice, matchesSlice, playersSlice, teamsSlice, standingsSlice,
│   │   │                        # analyticsSlice, authSlice, uiSlice, favoritesSlice
│   │   ├── services/            # Axios API clients for seasons, teams, players, matches, analytics, admin
│
├── docs/                        # Complete DBMS Documentation Suite
│   ├── er-diagram.md            # Mermaid ER diagram, cardinalities, relational model
│   ├── data-dictionary.md       # Full column constraints, data types, and index definitions
│   ├── normalization.md         # Formal mathematical proofs of 1NF, 2NF, 3NF and views theory
│   ├── data-sources.md          # Ingestion pipelines, licensing, scoping invariants
│   ├── api-reference.md         # REST API documentation with sample request/response payloads
│   ├── security-notes.md        # Token cleanup, bcrypt hashing, SQL injection mitigations
│   ├── test-plan.md             # Automated test matrix and verification checklist
│   ├── viva-notes.md            # Comprehensive viva voce academic defense guide
```

---

## 2. Relational DBMS Highlights

- **Normalization (3NF):** 12 relational tables mathematically partitioned to eliminate insertion, update, and deletion anomalies.
- **Dynamic Standings (`v_standings`):** League table is calculated on-the-fly using `DENSE_RANK() OVER (PARTITION BY season_id ORDER BY points DESC, gd DESC, gf DESC)` to guarantee relational consistency with the underlying match records.
- **Audit Reconciliation Pipeline:** Automated audit compares the dynamic `v_standings` against immutable official `final_standings` to verify 100% data fidelity.
- **Player Eligibility Triggers:** Before-insert triggers (`trg_validate_player_match_team_insert`) verify that a player belongs to either the home or away club before stats can be recorded.
- **ACID Transactions:** Match score and player statistics are recorded inside atomic transactions with automatic rollback on violation.
- **20 Advanced SQL Reports:** Complete suite in `database/reports/09_all_20_reports_suite.sql` demonstrating CTEs, `LAG()` goal progression, Pichichi rankings, home/away splits, and disciplinary tables.

---

## 3. Quickstart & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.0 or higher) running locally on port 3306

### Step 1: Database Setup
1. Open **MySQL Workbench** or your MySQL command line client as `root`.
2. Execute the script [`database/setup_user.sql`](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/database/setup_user.sql) to create the project user:
   - **User:** `fcb_user`@`localhost`
   - **Password:** `fcb123`
3. Initialize the schema and deterministic seed data by running the setup script from the project root:
   ```bash
   node server/src/scripts/initDb.js
   ```
   *(Or on Windows command prompt: `database\reset.bat`)*

### Step 2: Install Dependencies
From the repository root directory:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### Step 3: Run the Full-Stack Application
Start both the backend API and frontend client concurrently:
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend Client:** `http://localhost:5173`

---

## 4. Administrative Credentials (RBAC Demo)

To access the protected **Admin Control Center** (`/admin`):
- **Email:** `admin@fcbarcelona.cat`
- **Password:** `Admin@123456`
*(A "Use Demo Admin Credentials" quick-fill button is available on the `/login` screen).*

---

## 5. Automated Verification & Testing

Run backend integration tests:
```bash
npm test
```

Verify frontend production build:
```bash
npm run client:build
```

---

## 6. Documentation Suite

Detailed technical guides and academic documentation are available in the [`docs/`](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/) folder:
- [Entity-Relationship Diagram & Schema](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/er-diagram.md)
- [Data Dictionary](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/data-dictionary.md)
- [Database Normalization & 3NF Proofs](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/normalization.md)
- [Data Sources & ETL Pipelines](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/data-sources.md)
- [REST API Endpoint Reference](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/api-reference.md)
- [Security Notes & Vulnerability Remediations](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/security-notes.md)
- [Test Plan & Verification Strategy](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/test-plan.md)
- [Viva Voce Examination Notes](file:///c:/Users/Saksham/Downloads/Saksham/gpt_FCB_DBMS/docs/viva-notes.md)
