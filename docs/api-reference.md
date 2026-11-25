# REST API Specification & Endpoint Reference

The backend Express application serves a comprehensive RESTful JSON API for querying, analyzing, and mutating the La Liga relational database.

- **Base URL:** `http://localhost:5000/api`
- **Vite Proxy:** All client requests to `/api/*` are reverse-proxied to port 5000 in development.
- **Authentication:** Bearer token transmitted in HTTP request header:
  ```http
  Authorization: Bearer <jwt_token>
  ```

---

## 1. Response & Error Formats

### 1.1 Success Response (`200 OK`, `201 Created`)
```json
{
  "status": "success",
  "data": { ... },
  "pagination": {
    "total": 38,
    "page": 1,
    "limit": 15,
    "totalPages": 3
  }
}
```

### 1.2 Error Responses (`400`, `401`, `409`, `422`, `500`)
```json
{
  "status": "fail",
  "message": "Validation error: score must be a non-negative integer",
  "details": [
    { "field": "home_score", "issue": "Expected number >= 0" }
  ]
}
```

---

## 2. Public API Endpoints

### 2.1 System Health
- **`GET /api/health`**
  Returns service status, database connectivity check, and version information.

### 2.2 Seasons
- **`GET /api/seasons`**
  Returns all registered seasons ordered chronologically descending.
- **`GET /api/seasons/:id`**
  Returns specific season metadata and active status.

### 2.3 Clubs & Teams
- **`GET /api/teams`**
  - Query Params: `seasonId` (optional filter).
  - Returns participating clubs with stadium details and crest assets.
- **`GET /api/teams/:id`**
  Returns detailed club profile.
- **`GET /api/teams/:id/season-summary`**
  - Query Params: `seasonId` (default: 1).
  - Returns league rank, matches played, wins, draws, losses, GF, GA, GD, and points.
- **`GET /api/teams/:id/squad`**
  - Query Params: `seasonId` (default: 1).
  - Returns registered squad players with shirt numbers and positions.

### 2.4 Players
- **`GET /api/players`**
  - Query Params: `seasonId`, `teamId`, `position`, `search`, `page`, `limit`.
  - Returns paginated list of players.
- **`GET /api/players/:id`**
  Returns detailed player biography and all-time aggregate stats.
- **`GET /api/players/:id/seasons`**
  Returns season-by-season performance breakdown (goals, assists, minutes, appearances, cards).

### 2.5 Fixtures & Matches
- **`GET /api/matches`**
  - Query Params: `seasonId`, `teamId`, `matchday`, `status`, `page`, `limit`.
  - Returns list of fixtures with venue, status, and scorelines.
- **`GET /api/matches/:id`**
  Returns match details including participating teams, score, starting eleven, player stats, and goal events.

### 2.6 League Standings
- **`GET /api/standings`**
  - Query Params: `seasonId` (default: 1).
  - Queries `v_standings` view to return live table with 5-match form guide.
- **`GET /api/standings/reconcile`**
  - Query Params: `seasonId` (default: 1).
  - Performs live audit comparing dynamic view `v_standings` against audited `final_standings`.

### 2.7 DBMS Analytics
- **`GET /api/analytics/top-scorers`**
  - Query Params: `seasonId`, `limit` (default: 10).
  - Returns goal leaders with minutes-per-goal efficiency.
- **`GET /api/analytics/top-assists`**
  - Query Params: `seasonId`, `limit` (default: 10).
  - Returns top assist playmakers.
- **`GET /api/analytics/cards`**
  - Query Params: `seasonId`, `limit` (default: 10).
  - Returns disciplinary records (yellow cards and red cards).
- **`GET /api/analytics/minutes`**
  - Query Params: `seasonId`, `limit` (default: 10).
  - Returns players with highest registered pitch minutes.
- **`GET /api/analytics/head-to-head`**
  - Query Params: `teamA`, `teamB`.
  - Computes historical and seasonal encounter records between two clubs.
- **`GET /api/analytics/season-compare`**
  - Query Params: `seasons` (comma-separated IDs, e.g. `1,2`).
  - Returns side-by-side comparative totals across campaigns.
- **`GET /api/analytics/compare-players`**
  - Query Params: `playerA`, `playerB`, `seasonId`.
  - Returns comparative statistical radar metrics between two squad players.

---

## 3. Authentication & Security Endpoints

### 3.1 Authentication
- **`POST /api/auth/login`**
  - Request Body:
    ```json
    { "email": "admin@fcbarcelona.cat", "password": "Admin@123456" }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": { "id": 1, "email": "admin@fcbarcelona.cat", "role": "admin" }
    }
    ```
- **`GET /api/auth/me`**
  - Headers: `Authorization: Bearer <token>`
  - Returns current user profile if token is valid.

---

## 4. Protected Administrative Endpoints (Admin RBAC Required)

All endpoints below require a valid JWT with `role === 'admin'`. Non-admin or unauthenticated requests are rejected with `401 Unauthorized` or `403 Forbidden`.

### 4.1 System & Batch Auditing
- **`GET /api/admin/stats`**: Live database row counts across all major tables.
- **`GET /api/admin/import-batches`**: Audit logs of external ingestion jobs.

### 4.2 Clubs & Teams Management
- **`POST /api/admin/teams`**: Create new club.
- **`PUT /api/admin/teams/:id`**: Update club details.
- **`DELETE /api/admin/teams/:id`**: Remove club (enforces FK restrictions).

### 4.3 Squad & Players Management
- **`POST /api/admin/players`**: Register new player record.
- **`PUT /api/admin/players/:id`**: Update player details.
- **`DELETE /api/admin/players/:id`**: Remove player record.

### 4.4 Contract Registrations
- **`POST /api/admin/registrations`**: Assign player to team and season with shirt number.
- **`DELETE /api/admin/registrations/:id`**: Terminate squad registration.

### 4.5 Fixtures & Scores
- **`POST /api/admin/matches`**: Schedule new match fixture.
- **`PUT /api/admin/matches/:id`**: Update fixture date, stadium, or status.
- **`DELETE /api/admin/matches/:id`**: Cancel/delete fixture.

### 4.6 Atomic Match Result & Player Stats (ACID Transaction)
- **`PUT /api/matches/:id/result`**
  - Updates match score, status, and individual player match statistics in a single ACID transaction. If an eligibility trigger fails or any player violates constraints, the entire transaction rolls back.
  - Request Body:
    ```json
    {
      "home_score": 3,
      "away_score": 1,
      "status": "finished",
      "stats": [
        {
          "registration_id": 1,
          "started": 1,
          "minutes": 90,
          "goals": 2,
          "assists": 1,
          "yellow": 0,
          "red": 0
        }
      ]
    }
    ```
