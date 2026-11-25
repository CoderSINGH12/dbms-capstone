#!/usr/bin/env bash
set -e

echo "========================================================================="
echo "  FC Barcelona La Liga DBMS - Database Provisioning & Seed"
echo "========================================================================="

DB_USER="${DB_USER:-fcb_user}"
DB_PASS="${DB_PASS:-fcb123}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_sql() {
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" < "$1"
}

echo "[1/8] Running 01_create_database.sql..."
run_sql "$SCRIPT_DIR/schema/01_create_database.sql"

echo "[2/8] Running 02_tables.sql..."
run_sql "$SCRIPT_DIR/schema/02_tables.sql"

echo "[3/8] Running 03_indexes.sql..."
run_sql "$SCRIPT_DIR/schema/03_indexes.sql" || true

echo "[4/8] Running 04_views.sql..."
run_sql "$SCRIPT_DIR/schema/04_views.sql"

echo "[5/8] Running 05_triggers.sql..."
run_sql "$SCRIPT_DIR/schema/05_triggers.sql" || true

echo "[6/8] Seeding competitions, teams, and players..."
run_sql "$SCRIPT_DIR/seed/10_competitions_seasons.sql"
run_sql "$SCRIPT_DIR/seed/11_teams.sql"
run_sql "$SCRIPT_DIR/seed/12_season_teams.sql"
run_sql "$SCRIPT_DIR/seed/13_players_registrations.sql"

echo "[7/8] Seeding matches, match stats, and season totals..."
run_sql "$SCRIPT_DIR/seed/14_matches.sql"
run_sql "$SCRIPT_DIR/seed/15_stats.sql"
run_sql "$SCRIPT_DIR/seed/16_final_standings.sql"

echo "[8/8] Seeding admin user account..."
run_sql "$SCRIPT_DIR/seed/17_admin_user.sql"

echo "========================================================================="
echo "  SUCCESS! Database fcb_laliga_db has been fully created and seeded."
echo "========================================================================="
