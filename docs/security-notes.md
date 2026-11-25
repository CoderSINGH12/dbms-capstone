# Security Architecture & Vulnerability Remediation

This document summarizes the security posture, vulnerability remediations, and defensive controls implemented across **FC Barcelona La Liga DBMS**.

---

## 1. Initial Vulnerability Assessment & Remediations

### 1.1 Leaked API Token in Frontend Source & Bundle
- **Vulnerability:** The legacy repository contained a hardcoded third-party API token (`e68c9...`) in `src/services/footballApi.js`, which was subsequently bundled into the client distribution artifact `dist/assets/index-vmDkfa4D.js`. Because the project remote was public, the token was compromised.
- **Remediation Steps Taken:**
  1. Created an immutable git tag `backup-pre-refactor` to preserve historical work.
  2. Permanently deleted the insecure `src/services/footballApi.js` and removed all client-side third-party direct API calls.
  3. Purged `client/dist/` from the repository and added `dist/` to `.gitignore`.
  4. Sanitized `client/.env` and `client/.env.example` to only retain `VITE_API_BASE_URL=http://localhost:5000/api`. The `VITE_` prefix is strictly reserved for non-sensitive public configuration.
  5. Shifted all data ingestion and third-party interactions to the private backend server where secrets remain server-side in `server/.env`.

---

## 2. Relational Database Security Controls

### 2.1 Complete Mitigation of SQL Injection (SQLi)
- **Parameterized Queries:** 100% of SQL statements executed by the Express backend use prepared statements via `mysql2/promise` with bound parameter arrays:
  ```javascript
  // SECURE: Parameterized prepared statement
  const [rows] = await pool.query(
    'SELECT * FROM matches WHERE season_id = ? AND matchday = ?',
    [seasonId, matchday]
  );
  ```
- **Zero String Concatenation:** No user-supplied input is ever concatenated into raw SQL strings. Identifier whitelisting is applied if dynamic sorting columns are ever needed.

### 2.2 Dedicated Least-Privilege Database Principal
- The database is configured with a dedicated non-root MySQL user:
  ```sql
  CREATE USER IF NOT EXISTS 'fcb_user'@'localhost' IDENTIFIED BY 'fcb123';
  GRANT ALL PRIVILEGES ON fcb_laliga_db.* TO 'fcb_user'@'localhost';
  ```
- The application does not connect as `root`, preventing privilege escalation outside `fcb_laliga_db`.

---

## 3. Application Security Controls

### 3.1 Strong Password Hashing
- Administrative user passwords stored in `app_users` are hashed using **bcrypt** with **10 salt rounds**:
  ```javascript
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  ```
- Passwords are never stored in plaintext and are omitted from user query projections (`SELECT id, email, full_name, role FROM app_users`).

### 3.2 Stateless JWT Authentication & Role-Based Access Control (RBAC)
- Authenticated administrators receive a cryptographically signed JSON Web Token (JWT) using HMAC-SHA256.
- Middleware `verifyToken` inspects token validity and expiry:
  - If missing or invalid $\to$ `401 Unauthorized`.
- Middleware `requireAdmin` verifies `role === 'admin'`:
  - If insufficient privileges $\to$ `403 Forbidden`.

### 3.3 Strict Schema Validation (Zod)
- All mutation requests (`POST`, `PUT`, `DELETE`) are validated against deterministic Zod schemas before reaching business logic or SQL queries.
- Disallowed fields are stripped, preventing prototype pollution or unintended column updates.
- Numeric constraints (e.g. `minutes >= 0 AND minutes <= 130`, non-negative goals) are enforced in application memory before hitting database CHECK constraints.

### 3.4 HTTP Security Headers & CORS
- Backend configures `cors` to only allow trusted origins (`http://localhost:5173` in development).
- Client communications use a Vite proxy to prevent cross-origin issues during local evaluation.
