# ============================================================================
#  FC Barcelona La Liga DBMS - Full Database Setup Script
#  Run this script from PowerShell as an administrator.
#
#  What it does:
#    1. Prompts for your MySQL root password
#    2. Creates fcb_user@localhost with password 'fcb123'
#    3. Grants all privileges on fcb_laliga_db
#    4. Runs reset.bat to create schema, indexes, views, triggers & seed data
# ============================================================================

$MYSQL = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"

if (-not (Test-Path $MYSQL)) {
    Write-Error "MySQL not found at: $MYSQL"
    exit 1
}

Write-Host ""
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "  FC Barcelona La Liga DBMS - Full Database Setup" -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1: Creating fcb_user (requires MySQL root password)" -ForegroundColor Yellow
Write-Host "Leave blank and press Enter if root has no password." -ForegroundColor DarkGray
Write-Host ""

$rootPass = Read-Host -Prompt "Enter MySQL root password" -AsSecureString
$plainPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPass)
)

# Build the SQL to create the user and grant privileges
$setupSql = @"
CREATE USER IF NOT EXISTS 'fcb_user'@'localhost' IDENTIFIED BY 'fcb123';
GRANT ALL PRIVILEGES ON *.* TO 'fcb_user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SELECT 'fcb_user created and granted successfully!' AS status;
"@

$tempSql = Join-Path $env:TEMP "fcb_setup_user.sql"
$setupSql | Set-Content -Path $tempSql -Encoding UTF8

Write-Host ""
Write-Host "  Running setup_user.sql as root..." -ForegroundColor Gray

if ($plainPass -eq "") {
    & $MYSQL -u root --execute="source $tempSql" 2>&1
} else {
    & $MYSQL -u root "-p$plainPass" --execute="source $tempSql" 2>&1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Could not create fcb_user. Check your root password and try again." -ForegroundColor Red
    Remove-Item $tempSql -ErrorAction SilentlyContinue
    exit 1
}

Remove-Item $tempSql -ErrorAction SilentlyContinue
Write-Host "  [OK] fcb_user created successfully." -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Running schema, triggers, views, and seed data..." -ForegroundColor Yellow
Write-Host ""

$resetBat = Join-Path $PSScriptRoot "reset.bat"
& cmd.exe /c $resetBat

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] reset.bat failed. Check output above for details." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Database is fully set up. You can now start the server:" -ForegroundColor Green
Write-Host "    cd server && npm run dev" -ForegroundColor White
Write-Host "==========================================================================" -ForegroundColor Green
Write-Host ""
