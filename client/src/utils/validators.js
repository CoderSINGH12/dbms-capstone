/**
 * Client-side validation utilities for forms
 */

export const validateMatchForm = (values) => {
  const errors = {};
  if (!values.season_id) errors.season_id = 'Season is required';
  if (!values.matchday || values.matchday < 1 || values.matchday > 38) {
    errors.matchday = 'Matchday must be between 1 and 38';
  }
  if (!values.home_team_id) errors.home_team_id = 'Home team is required';
  if (!values.away_team_id) errors.away_team_id = 'Away team is required';
  if (values.home_team_id && values.away_team_id && values.home_team_id === values.away_team_id) {
    errors.away_team_id = 'A club cannot play against itself';
  }
  if (values.status === 'finished') {
    if (values.home_score === '' || values.home_score === null || values.home_score < 0) {
      errors.home_score = 'Finished match must have valid home score';
    }
    if (values.away_score === '' || values.away_score === null || values.away_score < 0) {
      errors.away_score = 'Finished match must have valid away score';
    }
  }
  return errors;
};

export const validatePlayerForm = (values) => {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) {
    errors.name = 'Player name must be at least 2 characters';
  }
  return errors;
};

export const validateTeamForm = (values) => {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) errors.name = 'Team name is required';
  if (!values.short_name) errors.short_name = 'Short name is required';
  if (!values.city) errors.city = 'City is required';
  if (!values.stadium) errors.stadium = 'Stadium is required';
  return errors;
};
