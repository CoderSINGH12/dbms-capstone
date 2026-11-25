import fetch from 'node-fetch';
import { ENV } from '../../src/config/env.js';

export const fetchFootballDataOrgMatches = async (competitionCode = 'PD', season = 2024) => {
  if (!ENV.FOOTBALL_DATA_TOKEN) {
    throw new Error('FOOTBALL_DATA_API_TOKEN is not configured in server/.env');
  }

  const url = `https://api.football-data.org/v4/competitions/${competitionCode}/matches?season=${season}`;
  const response = await fetch(url, {
    headers: { 'X-Auth-Token': ENV.FOOTBALL_DATA_TOKEN },
  });

  if (!response.ok) {
    throw new Error(`External API Error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.matches || [];
};
