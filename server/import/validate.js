export const validateMatchRecord = (record, validTeamIds, existingFixtures = new Set()) => {
  const errors = [];

  // Check 1: Teams must not be identical
  if (record.home_team_id === record.away_team_id) {
    errors.push(`Team cannot play against itself (ID: ${record.home_team_id})`);
  }

  // Check 2: Both teams must belong to this season
  if (!validTeamIds.has(record.home_team_id)) {
    errors.push(`Home team ID ${record.home_team_id} is not registered in this season`);
  }
  if (!validTeamIds.has(record.away_team_id)) {
    errors.push(`Away team ID ${record.away_team_id} is not registered in this season`);
  }

  // Check 3: Scores validity for finished status
  if (record.status === 'finished') {
    if (record.home_score === null || record.home_score === undefined || record.home_score < 0) {
      errors.push(`Finished match has invalid home score: ${record.home_score}`);
    }
    if (record.away_score === null || record.away_score === undefined || record.away_score < 0) {
      errors.push(`Finished match has invalid away score: ${record.away_score}`);
    }
  }

  // Check 4: Fixture uniqueness in season
  const fixtureKey = `${record.season_id}_${record.home_team_id}_${record.away_team_id}`;
  if (existingFixtures.has(fixtureKey)) {
    errors.push(`Duplicate fixture found for season ${record.season_id} between teams ${record.home_team_id} and ${record.away_team_id}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
