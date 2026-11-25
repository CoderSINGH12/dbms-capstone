// StatsBomb open data loader adapter
export const parseStatsbombEvents = (matchEvents) => {
  const playerStatsMap = new Map();

  for (const event of matchEvents) {
    const player = event.player;
    if (!player) continue;

    if (!playerStatsMap.has(player.id)) {
      playerStatsMap.set(player.id, {
        externalPlayerId: player.id,
        name: player.name,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellow: 0,
        red: 0,
      });
    }

    const stat = playerStatsMap.get(player.id);
    if (event.type.name === 'Shot' && event.shot?.outcome?.name === 'Goal') {
      stat.goals += 1;
    }
    if (event.type.name === 'Bad Behaviour' && event.bad_behaviour?.card?.name === 'Yellow Card') {
      stat.yellow += 1;
    }
  }

  return Array.from(playerStatsMap.values());
};
