-- ============================================================================
-- FC Barcelona La Liga DBMS - User Setup Script
-- Run this file in MySQL Workbench (as root or an admin user) to provision
-- the application user for the Express backend.
-- ============================================================================

CREATE USER IF NOT EXISTS 'fcb_user'@'localhost' IDENTIFIED BY 'fcb123';
GRANT ALL PRIVILEGES ON *.* TO 'fcb_user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

SELECT 'User fcb_user@localhost created and granted privileges successfully!' AS status;
CREATE USER IF NOT EXISTS 'fcb_user'@'localhost' IDENTIFIED BY 'fcb123';
GRANT ALL PRIVILEGES ON fcb_laliga_db.* TO 'fcb_user'@'localhost';
FLUSH PRIVILEGES;
