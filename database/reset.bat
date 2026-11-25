@echo off
setlocal enabledelayedexpansion

echo =========================================================================
echo   FC Barcelona La Liga DBMS - Database Provisioning & Seed
echo =========================================================================

set MYSQL_BIN="C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
if not exist %MYSQL_BIN% (
    set MYSQL_BIN=mysql
)

set DB_USER=fcb_user
set DB_PASS=fcb123
set DB_HOST=localhost
set DB_PORT=3306

echo [1/8] Running 01_create_database.sql...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0schema\01_create_database.sql"
if %errorlevel% neq 0 goto error

echo [2/8] Running 02_tables.sql...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0schema\02_tables.sql"
if %errorlevel% neq 0 goto error

echo [3/8] Running 03_indexes.sql...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0schema\03_indexes.sql"
if %errorlevel% neq 0 echo Warning: Indexes may already exist, continuing...

echo [4/8] Running 04_views.sql...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0schema\04_views.sql"
if %errorlevel% neq 0 goto error

echo [5/8] Running 05_triggers.sql...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0schema\05_triggers.sql"
if %errorlevel% neq 0 echo Warning: Triggers may already exist, continuing...

echo [6/8] Seeding competitions, teams, and players...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\10_competitions_seasons.sql"
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\11_teams.sql"
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\12_season_teams.sql"
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\13_players_registrations.sql"

echo [7/8] Seeding matches, match stats, and season totals...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\14_matches.sql"
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\15_stats.sql"
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\16_final_standings.sql"

echo [8/8] Seeding admin user account...
%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < "%~dp0seed\17_admin_user.sql"

echo =========================================================================
echo   SUCCESS! Database fcb_laliga_db has been fully created and seeded.
echo =========================================================================
exit /b 0

:error
echo [ERROR] An error occurred during database setup.
echo Please ensure fcb_user has been created (see database/setup_user.sql).
exit /b 1
