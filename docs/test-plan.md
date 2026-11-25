# Test Plan & Verification Strategy

This document outlines the testing strategy, test suites, automated scripts, and manual walkthrough checklists for **FC Barcelona La Liga DBMS**.

---

## 1. Testing Strategy Overview

The testing methodology spans three layers:

```
[Database Layer]  ──> Constraint violations, trigger validation, rollback transactions
[Backend Layer]   ──> Node.js native test runner + Supertest API integration tests
[Frontend Layer]  ──> Production compilation test, state verification, responsive UI checks
```

---

## 2. Automated Test Suites

### 2.1 Backend API Integration Tests (`server/tests/api/api.test.js`)
Executed via Node.js built-in test runner:
```bash
cd server
npm test
```
**Test Cases Covered:**
1. `GET /api/health`: Returns 200 OK with service identifier and active status.
2. `GET /api/seasons`: Returns 200 OK with formatted list of all registered seasons.
3. `POST /api/auth/login`: Verifies that invalid credentials return 401 Unauthorized or validation failure.
4. `GET /api/admin/stats`: Verifies that unauthenticated requests to protected admin endpoints are rejected with 401.

### 2.2 Frontend Production Build Verification
Executed via Vite build runner:
```bash
cd client
npm run build
```
Ensures zero Rollup resolution errors, type-safe imports, and code-split bundles for all 18 routes.

---

## 3. Database Integrity & Constraint Verification Scripts

Interactive verification scripts are provided under `database/demos/`:

### 3.1 Transaction Rollback Demo (`database/demos/transaction_rollback.sql`)
- **Objective:** Demonstrate atomicity during score and stats entry.
- **Scenario:** Inserts a match score and attempts to register statistics for an ineligible player. The second insert fails, triggering a `ROLLBACK` that reverts the match score as well.

### 3.2 Constraint Violations Demo (`database/demos/constraint_violations.sql`)
- **Objective:** Prove that database CHECK constraints and unique indexes actively reject invalid data:
  - Attempting to schedule a match where `home_team_id = away_team_id` $\to$ Rejected.
  - Attempting to enter negative minutes played $\to$ Rejected.
  - Attempting duplicate shirt number on same club in same season $\to$ Rejected.

### 3.3 Query Execution Plan (`database/demos/explain_before_after_index.sql`)
- **Objective:** Demonstrates the impact of composite indexes on `matches(season_id, matchday)` and `player_match_stats(match_id)`.
- **Observation:** `EXPLAIN` shows transition from table scan (`ALL`) to index range scan (`ref`).

---

## 4. End-to-End Manual Walkthrough Checklist

| Step | Action | Expected Result | Pass/Fail |
| :---: | :--- | :--- | :---: |
| 1 | Launch full application (`npm run dev`) | Server runs on `:5000`, Client runs on `:5173`. | PASS |
| 2 | Open Dashboard (`/`) | Displays Barcelona season summary, standings card, and recent matches. Goal difference has correct +/- sign. | PASS |
| 3 | Change season via top dropdown | Dashboard immediately refreshes with statistics for selected campaign. | PASS |
| 4 | Open Squad & Players (`/players`) | Search by player name and filter by position. Click a player card to open detailed profile with LAG progression chart. | PASS |
| 5 | Open Comparison Lab (`/compare`) | Compare FC Barcelona vs Real Madrid in Head-to-Head tab. Compare two seasons in Season vs Season tab. | PASS |
| 6 | Save favorites | Click heart icon on match or player. Navigate to `/favorites` to confirm persisted item. | PASS |
| 7 | Admin Login (`/login`) | Click "Use Demo Admin Credentials" and submit. Successfully redirects to `/admin`. | PASS |
| 8 | Standings Audit (`/admin/standings`) | Click "Re-Run Integrity Audit". Verifies live `v_standings` against `final_standings`. | PASS |
| 9 | Atomic Stats Entry (`/admin/stats`) | Select a match and update player minutes and goals. Successfully commits transaction. | PASS |
