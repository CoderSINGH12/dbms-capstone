-- ============================================================================
-- 17_admin_user.sql
-- Seed administrative account for portal access (Default: admin@fcbarcelona.cat / Admin@123456)
-- ============================================================================

USE fcb_laliga_db;

INSERT INTO users (id, email, password_hash, name, role) VALUES
(1, 'admin@fcbarcelona.cat', '$2b$10$tZkS0y1C8QxWbY8.v49Dne0i9fK3N9e1eKzG/iJkG2/gq3zQ9rDfa', 'Chief Data Officer', 'admin'),
(2, 'analyst@fcbarcelona.cat', '$2b$10$tZkS0y1C8QxWbY8.v49Dne0i9fK3N9e1eKzG/iJkG2/gq3zQ9rDfa', 'First Team Tactical Analyst', 'editor')
ON DUPLICATE KEY UPDATE 
  name=VALUES(name), 
  role=VALUES(role),
  password_hash=VALUES(password_hash);
