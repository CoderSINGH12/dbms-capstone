-- ============================================================================
-- 05_triggers.sql
-- Triggers for complex integrity rules that cannot be expressed as CHECK constraints
-- ============================================================================

USE fcb_laliga_db;

DELIMITER $$

-- Trigger 1: Ensure player's registered team matches either the home or away team of the match
CREATE TRIGGER trg_validate_player_match_team_insert
BEFORE INSERT ON player_match_stats
FOR EACH ROW
BEGIN
  DECLARE v_home_team_id INT;
  DECLARE v_away_team_id INT;
  DECLARE v_reg_team_id INT;
  DECLARE v_reg_season_id INT;
  DECLARE v_match_season_id INT;

  -- Get match details
  SELECT season_id, home_team_id, away_team_id 
    INTO v_match_season_id, v_home_team_id, v_away_team_id
    FROM matches 
    WHERE id = NEW.match_id;

  -- Get registration details
  SELECT season_id, team_id 
    INTO v_reg_season_id, v_reg_team_id
    FROM player_registrations 
    WHERE id = NEW.registration_id;

  -- Check season alignment
  IF v_match_season_id <> v_reg_season_id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Integrity violation: Player registration season does not match match season.';
  END IF;

  -- Check team participation
  IF v_reg_team_id <> v_home_team_id AND v_reg_team_id <> v_away_team_id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Integrity violation: Player does not belong to either the home or away team for this match.';
  END IF;
END$$

-- Trigger 2: Same validation on UPDATE
CREATE TRIGGER trg_validate_player_match_team_update
BEFORE UPDATE ON player_match_stats
FOR EACH ROW
BEGIN
  DECLARE v_home_team_id INT;
  DECLARE v_away_team_id INT;
  DECLARE v_reg_team_id INT;
  DECLARE v_reg_season_id INT;
  DECLARE v_match_season_id INT;

  SELECT season_id, home_team_id, away_team_id 
    INTO v_match_season_id, v_home_team_id, v_away_team_id
    FROM matches 
    WHERE id = NEW.match_id;

  SELECT season_id, team_id 
    INTO v_reg_season_id, v_reg_team_id
    FROM player_registrations 
    WHERE id = NEW.registration_id;

  IF v_match_season_id <> v_reg_season_id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Integrity violation: Player registration season does not match match season.';
  END IF;

  IF v_reg_team_id <> v_home_team_id AND v_reg_team_id <> v_away_team_id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Integrity violation: Player does not belong to either the home or away team for this match.';
  END IF;
END$$

DELIMITER ;
