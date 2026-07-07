/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Match, Team, MatchEvent, MatchStatistics, Lineup } from '@/types/football';


export const API_BASE_URL = 'https://api.football-data.org/v4';
// Server-side secret – never exposed to the browser bundle
// The token is stored in a non-public env variable.

async function fetchFromAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const url = `/api/football?endpoint=${encodeURIComponent(endpoint)}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      console.warn(`API proxy error: ${res.status} ${res.statusText}`);
      return null;
    }
    
    return await res.json();
  } catch (err) {
    console.warn('Fetch error:', err);
    return null;
  }
}

export async function getLiveMatches(): Promise<Match[]> {
  const data = await fetchFromAPI<{ matches: any[] }>('/matches?status=LIVE');
  
  if (!data?.matches) {
    return [];
  }
  
  return data.matches.map(mapToMatch);
}

export async function getMatchById(id: number): Promise<Match | null> {
  const data = await fetchFromAPI<any>(`/matches/${id}`);
  
  if (!data) {
    return null;
  }
  
  return mapToMatch(data);
}

export async function getTodaysMatches(): Promise<Match[]> {
  const today = new Date();
  const dateFrom = today.toISOString().split('T')[0];
  
  const future = new Date(today);
  future.setDate(future.getDate() + 3);
  const dateTo = future.toISOString().split('T')[0];

  const data = await fetchFromAPI<{ matches: any[] }>(`/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
  
  if (!data?.matches) {
    return [];
  }
  
  return data.matches.map(mapToMatch);
}

export async function getCompetitions() {
  const data = await fetchFromAPI<{ competitions: any[] }>('/competitions');
  return data?.competitions || [];
}

function mapToMatch(data: any): Match {
  return {
    id: data.id,
    homeTeam: mapToTeam(data.homeTeam, 'home'),
    awayTeam: mapToTeam(data.awayTeam, 'away'),
    competition: {
      id: data.competition?.id || 0,
      name: data.competition?.name || 'Friendly',
      emblem: data.competition?.emblem,
    },
    utcDate: data.utcDate,
    status: data.status === 'TIMED' ? 'SCHEDULED' : data.status,
    minute: data.minute,
    score: {
      fullTime: {
        home: data.score?.fullTime?.home,
        away: data.score?.fullTime?.away,
      },
      halfTime: {
        home: data.score?.halfTime?.home,
        away: data.score?.halfTime?.away,
      },
    },
    events: data.events?.length ? data.events.map(mapToEvent) : [],
    venue: data.venue || 'TBD',
    attendance: data.attendance || 0,
    referee: data.referees?.[0]?.name || 'TBD',
    statistics: data.statistics || null,
    homeLineup: data.homeLineup || null,
    awayLineup: data.awayLineup || null,
  };
}

function mapToTeam(teamData: any, side: 'home' | 'away'): Team {
  const name = teamData?.name || 'TBD';
  return {
    id: teamData?.id || 0,
    name: name,
    shortName: teamData?.shortName || name.split(' ').pop() || 'TBD',
    crest: teamData?.crest,
    colors: {
      primary: side === 'home' ? '#1e40af' : '#dc2626',
      secondary: side === 'home' ? '#3b82f6' : '#ef4444',
    },
  };
}

function mapToEvent(eventData: any): MatchEvent {
  return {
    id: eventData.id || Math.random(),
    type: mapEventType(eventData.type),
    minute: eventData.minute,
    extraMinute: eventData.extraMinute,
    teamId: eventData.team?.id || 0,
    playerId: eventData.player?.id,
    playerName: eventData.player?.name,
    assistPlayerId: eventData.assist?.id,
    assistPlayerName: eventData.assist?.name,
    cardType: eventData.cardType,
    reason: eventData.reason,
  };
}

function mapEventType(type: string): MatchEvent['type'] {
  const eventMap: Record<string, MatchEvent['type']> = {
    'GOAL': 'goal',
    'PENALTY': 'penalty',
    'OWN_GOAL': 'own_goal',
    'YELLOW_CARD': 'card',
    'RED_CARD': 'card',
    'SECOND_YELLOW_CARD': 'card',
    'SUBSTITUTION': 'substitution',
    'FOUL': 'foul',
    'VAR': 'var',
  };
  return eventMap[type] || 'foul';
}

// Mock data for demo when API limits are reached
function getMockLiveMatches(): Match[] {
  return [
    getMockMatch(1),
    getMockMatch(2),
    getMockMatch(3),
  ];
}

export function getMockTodaysMatches(): Match[] {
  return [
    ...getMockLiveMatches(),
    getMockMatch(4),
    getMockMatch(5),
  ];
}

function getMockMatch(id: number): Match {
  const mockMatches: Record<number, Match> = {
    1: {
      id: 1,
      homeTeam: {
        id: 57,
        name: 'Arsenal FC',
        shortName: 'Arsenal',
        crest: 'https://crests.football-data.org/57.png',
        colors: { primary: '#EF0107', secondary: '#FFFFFF' },
      },
      awayTeam: {
        id: 65,
        name: 'Manchester City FC',
        shortName: 'Man City',
        crest: 'https://crests.football-data.org/65.png',
        colors: { primary: '#6CABDD', secondary: '#FFFFFF' },
      },
      competition: {
        id: 2021,
        name: 'Premier League',
        emblem: 'https://crests.football-data.org/PL.png',
      },
      utcDate: new Date().toISOString(),
      status: 'LIVE',
      minute: 67,
      score: {
        fullTime: { home: 2, away: 1 },
        halfTime: { home: 1, away: 0 },
      },
      events: getMockEvents(1),
      statistics: getMockStatistics(),
      homeLineup: getMockLineup('home'),
      awayLineup: getMockLineup('away'),
      venue: 'Emirates Stadium',
      attendance: 60260,
      referee: 'Michael Oliver',
    },
    2: {
      id: 2,
      homeTeam: {
        id: 81,
        name: 'FC Barcelona',
        shortName: 'Barcelona',
        crest: 'https://crests.football-data.org/81.png',
        colors: { primary: '#004D98', secondary: '#A50044' },
      },
      awayTeam: {
        id: 86,
        name: 'Real Madrid CF',
        shortName: 'Real Madrid',
        crest: 'https://crests.football-data.org/86.png',
        colors: { primary: '#FFFFFF', secondary: '#FEBE10' },
      },
      competition: {
        id: 2014,
        name: 'La Liga',
        emblem: 'https://crests.football-data.org/PD.png',
      },
      utcDate: new Date().toISOString(),
      status: 'LIVE',
      minute: 34,
      score: {
        fullTime: { home: 1, away: 1 },
        halfTime: { home: 0, away: 0 },
      },
      events: getMockEvents(2),
      statistics: getMockStatistics(),
      homeLineup: getMockLineup('home'),
      awayLineup: getMockLineup('away'),
      venue: 'Camp Nou',
      attendance: 99354,
      referee: 'Antonio Mateu Lahoz',
    },
    3: {
      id: 3,
      homeTeam: {
        id: 98,
        name: 'AC Milan',
        shortName: 'Milan',
        crest: 'https://crests.football-data.org/98.png',
        colors: { primary: '#FB090B', secondary: '#000000' },
      },
      awayTeam: {
        id: 109,
        name: 'Juventus FC',
        shortName: 'Juventus',
        crest: 'https://crests.football-data.org/109.png',
        colors: { primary: '#000000', secondary: '#FFFFFF' },
      },
      competition: {
        id: 2019,
        name: 'Serie A',
        emblem: 'https://crests.football-data.org/SA.png',
      },
      utcDate: new Date().toISOString(),
      status: 'LIVE',
      minute: 89,
      score: {
        fullTime: { home: 0, away: 0 },
        halfTime: { home: 0, away: 0 },
      },
      events: getMockEvents(3),
      statistics: getMockStatistics(),
      homeLineup: getMockLineup('home'),
      awayLineup: getMockLineup('away'),
      venue: 'San Siro',
      attendance: 75923,
      referee: 'Daniele Orsato',
    },
    4: {
      id: 4,
      homeTeam: {
        id: 5,
        name: 'FC Bayern München',
        shortName: 'Bayern',
        crest: 'https://crests.football-data.org/5.png',
        colors: { primary: '#DC052D', secondary: '#FFFFFF' },
      },
      awayTeam: {
        id: 4,
        name: 'Borussia Dortmund',
        shortName: 'Dortmund',
        crest: 'https://crests.football-data.org/4.png',
        colors: { primary: '#FDE100', secondary: '#000000' },
      },
      competition: {
        id: 2002,
        name: 'Bundesliga',
        emblem: 'https://crests.football-data.org/BL1.png',
      },
      utcDate: new Date(Date.now() - 7200000).toISOString(),
      status: 'FINISHED',
      minute: 90,
      score: {
        fullTime: { home: 3, away: 2 },
        halfTime: { home: 2, away: 1 },
      },
      events: getMockEvents(4),
      statistics: getMockStatistics(),
      venue: 'Allianz Arena',
      attendance: 75000,
    },
    5: {
      id: 5,
      homeTeam: {
        id: 524,
        name: 'Paris Saint-Germain FC',
        shortName: 'PSG',
        crest: 'https://crests.football-data.org/524.png',
        colors: { primary: '#004170', secondary: '#DA291C' },
      },
      awayTeam: {
        id: 516,
        name: 'Olympique Marseille',
        shortName: 'Marseille',
        crest: 'https://crests.football-data.org/516.png',
        colors: { primary: '#2FAEE0', secondary: '#FFFFFF' },
      },
      competition: {
        id: 2015,
        name: 'Ligue 1',
        emblem: 'https://crests.football-data.org/FL1.png',
      },
      utcDate: new Date(Date.now() + 7200000).toISOString(),
      status: 'SCHEDULED',
      score: {
        fullTime: { home: null, away: null },
        halfTime: { home: null, away: null },
      },
      events: [],
      venue: 'Parc des Princes',
      attendance: 47929,
    },
  };
  
  return mockMatches[id] || mockMatches[1];
}

function getMockEvents(matchId: number, homeTeamId?: number, awayTeamId?: number): MatchEvent[] {
  const hId = homeTeamId || 57;
  const aId = awayTeamId || 65;
  const events: Record<number, MatchEvent[]> = {
    1: [
      { id: 1, type: 'goal', minute: 23, teamId: hId, playerId: 1, playerName: 'Bukayo Saka', assistPlayerName: 'Martin Ødegaard' },
      { id: 2, type: 'card', minute: 38, teamId: aId, playerId: 2, playerName: 'Rodri', cardType: 'yellow', reason: 'Tactical foul' },
      { id: 3, type: 'goal', minute: 52, teamId: aId, playerId: 3, playerName: 'Erling Haaland', assistPlayerName: 'Kevin De Bruyne' },
      { id: 4, type: 'goal', minute: 61, teamId: hId, playerId: 4, playerName: 'Gabriel Jesus' },
      { id: 5, type: 'substitution', minute: 65, teamId: hId, playerOut: { id: 5, name: 'Thomas Partey', shirtNumber: 5, position: 'MID' }, playerIn: { id: 6, name: 'Jorginho', shirtNumber: 20, position: 'MID' } },
    ],
    2: [
      { id: 6, type: 'card', minute: 12, teamId: aId, playerId: 7, playerName: 'Federico Valverde', cardType: 'yellow' },
      { id: 7, type: 'goal', minute: 28, teamId: hId, playerId: 8, playerName: 'Robert Lewandowski', assistPlayerName: 'Pedri' },
      { id: 8, type: 'goal', minute: 31, teamId: aId, playerId: 9, playerName: 'Vinícius Júnior' },
    ],
    3: [
      { id: 9, type: 'card', minute: 45, teamId: hId, playerId: 10, playerName: 'Fikayo Tomori', cardType: 'yellow' },
      { id: 10, type: 'substitution', minute: 58, teamId: aId, playerOut: { id: 11, name: 'Paul Pogba', shirtNumber: 10, position: 'MID' }, playerIn: { id: 12, name: 'Manuel Locatelli', shirtNumber: 27, position: 'MID' } },
      { id: 11, type: 'card', minute: 72, teamId: aId, playerId: 13, playerName: 'Danilo', cardType: 'yellow' },
      { id: 12, type: 'var', minute: 85, teamId: hId, decision: 'No penalty - simulation' },
    ],
    4: [
      { id: 13, type: 'goal', minute: 15, teamId: hId, playerId: 14, playerName: 'Harry Kane' },
      { id: 14, type: 'goal', minute: 28, teamId: aId, playerId: 15, playerName: 'Niclas Füllkrug' },
      { id: 15, type: 'goal', minute: 41, teamId: hId, playerId: 16, playerName: 'Jamal Musiala' },
      { id: 16, type: 'goal', minute: 67, teamId: aId, playerId: 17, playerName: 'Julian Brandt' },
      { id: 17, type: 'goal', minute: 83, teamId: hId, playerId: 14, playerName: 'Harry Kane' },
    ],
  };
  
  const mockId = (matchId % 4) || 4;
  return events[mockId] || events[1];
}

function getMockStatistics(): MatchStatistics {
  return {
    possession: { home: 58, away: 42 },
    shots: { home: 14, away: 9 },
    shotsOnTarget: { home: 6, away: 4 },
    shotsOffTarget: { home: 5, away: 3 },
    blockedShots: { home: 3, away: 2 },
    corners: { home: 7, away: 4 },
    offsides: { home: 2, away: 3 },
    fouls: { home: 11, away: 14 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 0 },
    saves: { home: 3, away: 4 },
    passes: { home: 512, away: 378 },
    passAccuracy: { home: 88, away: 82 },
    tackles: { home: 18, away: 22 },
    attacks: { home: 87, away: 64 },
    dangerousAttacks: { home: 52, away: 38 },
    expectedGoals: { home: 2.3, away: 1.1 },
  };
}

function getMockLineup(side: 'home' | 'away'): Lineup {
  const homePlayers: any[] = [
    { id: 101, name: 'Aaron Ramsdale', shirtNumber: 1, position: 'GK' },
    { id: 102, name: 'Ben White', shirtNumber: 4, position: 'DEF' },
    { id: 103, name: 'William Saliba', shirtNumber: 2, position: 'DEF' },
    { id: 104, name: 'Gabriel Magalhães', shirtNumber: 6, position: 'DEF' },
    { id: 105, name: 'Oleksandr Zinchenko', shirtNumber: 35, position: 'DEF' },
    { id: 106, name: 'Declan Rice', shirtNumber: 41, position: 'MID' },
    { id: 107, name: 'Martin Ødegaard', shirtNumber: 8, position: 'MID' },
    { id: 108, name: 'Bukayo Saka', shirtNumber: 7, position: 'MID' },
    { id: 109, name: 'Kai Havertz', shirtNumber: 29, position: 'MID' },
    { id: 110, name: 'Gabriel Martinelli', shirtNumber: 11, position: 'FWD' },
    { id: 111, name: 'Gabriel Jesus', shirtNumber: 9, position: 'FWD' },
  ];
  
  const awayPlayers: any[] = [
    { id: 201, name: 'Ederson', shirtNumber: 31, position: 'GK' },
    { id: 202, name: 'Kyle Walker', shirtNumber: 2, position: 'DEF' },
    { id: 203, name: 'Rúben Dias', shirtNumber: 3, position: 'DEF' },
    { id: 204, name: 'Nathan Aké', shirtNumber: 6, position: 'DEF' },
    { id: 205, name: 'Josko Gvardiol', shirtNumber: 24, position: 'DEF' },
    { id: 206, name: 'Rodri', shirtNumber: 16, position: 'MID' },
    { id: 207, name: 'Kevin De Bruyne', shirtNumber: 17, position: 'MID' },
    { id: 208, name: 'Bernardo Silva', shirtNumber: 20, position: 'MID' },
    { id: 209, name: 'Phil Foden', shirtNumber: 47, position: 'MID' },
    { id: 210, name: 'Jack Grealish', shirtNumber: 10, position: 'FWD' },
    { id: 211, name: 'Erling Haaland', shirtNumber: 9, position: 'FWD' },
  ];
  
  const homeSubs: any[] = [
      { id: 301, name: 'David Raya', shirtNumber: 22, position: 'GK' },
      { id: 302, name: 'Takehiro Tomiyasu', shirtNumber: 18, position: 'DEF' },
      { id: 303, name: 'Jakub Kiwior', shirtNumber: 15, position: 'DEF' },
      { id: 304, name: 'Jorginho', shirtNumber: 20, position: 'MID' },
      { id: 305, name: 'Fabio Vieira', shirtNumber: 21, position: 'MID' },
      { id: 306, name: 'Leandro Trossard', shirtNumber: 19, position: 'FWD' },
      { id: 307, name: 'Eddie Nketiah', shirtNumber: 14, position: 'FWD' },
    ];

    const awaySubs: any[] = [
      { id: 401, name: 'Stefan Ortega', shirtNumber: 18, position: 'GK' },
      { id: 402, name: 'John Stones', shirtNumber: 5, position: 'DEF' },
      { id: 403, name: 'Manuel Akanji', shirtNumber: 25, position: 'DEF' },
      { id: 404, name: 'Mateo Kovačić', shirtNumber: 8, position: 'MID' },
      { id: 405, name: 'Julián Álvarez', shirtNumber: 19, position: 'FWD' },
      { id: 406, name: 'Matheus Nunes', shirtNumber: 27, position: 'MID' },
      { id: 407, name: 'Rico Lewis', shirtNumber: 82, position: 'DEF' },
    ];

  return {
    formation: side === 'home' ? '4-3-3' : '4-2-3-1',
    startingXI: side === 'home' ? homePlayers : awayPlayers,
    substitutes: side === 'home' ? homeSubs : awaySubs,
    coach: {
      name: side === 'home' ? 'Mikel Arteta' : 'Pep Guardiola',
    },
  };
}