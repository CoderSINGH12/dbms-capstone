// Team alias dictionary mapping variant external names to canonical names
export const TEAM_ALIASES = {
  'Barcelona': 'FC Barcelona',
  'Barca': 'FC Barcelona',
  'Barça': 'FC Barcelona',
  'Real Madrid': 'Real Madrid CF',
  'Atletico Madrid': 'Club Atlético de Madrid',
  'Atlético de Madrid': 'Club Atlético de Madrid',
  'Athletic Bilbao': 'Athletic Club',
  'Athletic': 'Athletic Club',
  'Real Sociedad': 'Real Sociedad de Fútbol',
  'Betis': 'Real Betis Balompié',
  'Real Betis': 'Real Betis Balompié',
  'Sevilla': 'Sevilla FC',
  'Villarreal': 'Villarreal CF',
  'Valencia': 'Valencia CF',
  'Girona': 'Girona FC',
  'Celta': 'RC Celta de Vigo',
  'Celta Vigo': 'RC Celta de Vigo',
  'Osasuna': 'CA Osasuna',
  'Getafe': 'Getafe CF',
  'Rayo Vallecano': 'Rayo Vallecano',
  'Mallorca': 'RCD Mallorca',
  'Alaves': 'Deportivo Alavés',
  'Alavés': 'Deportivo Alavés',
  'Las Palmas': 'UD Las Palmas',
  'Espanyol': 'RCD Espanyol',
  'Leganes': 'CD Leganés',
  'Leganés': 'CD Leganés',
  'Valladolid': 'Real Valladolid CF',
  'Real Valladolid': 'Real Valladolid CF',
};

export const normalizeTeamName = (name) => {
  if (!name) return '';
  const trimmed = name.trim();
  return TEAM_ALIASES[trimmed] || trimmed;
};

export const normalizePosition = (rawPos) => {
  if (!rawPos) return 'Midfielder';
  const lower = rawPos.toLowerCase();
  if (lower.includes('goalkeeper') || lower.includes('keeper') || lower === 'gk') return 'Goalkeeper';
  if (lower.includes('defence') || lower.includes('defender') || lower.includes('back') || lower === 'df') return 'Defender';
  if (lower.includes('midfield') || lower === 'mf') return 'Midfielder';
  if (lower.includes('offence') || lower.includes('forward') || lower.includes('striker') || lower.includes('winger') || lower === 'fw') return 'Forward';
  return 'Midfielder';
};
