-- ============================================================================
-- 01_create_database.sql
-- Create and select the database with full UTF-8 Unicode collation support
-- ============================================================================

CREATE DATABASE IF NOT EXISTS fcb_laliga_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fcb_laliga_db;
