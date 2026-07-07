export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

export interface Player {
  id: number;
  name: string;
  shirtNumber: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photo?: string;
}

export interface Lineup {
  formation: string;
  startingXI: Player[];
  substitutes: Player[];
  coach: {
    name: string;
    photo?: string;
  };
}

export interface MatchEvent {
  id: number;
  type: 'goal' | 'card' | 'substitution' | 'foul' | 'var' | 'penalty' | 'own_goal';
  minute: number;
  extraMinute?: number;
  teamId: number;
  playerId?: number;
  playerName?: string;
  assistPlayerId?: number;
  assistPlayerName?: string;
  cardType?: 'yellow' | 'red' | 'yellow_red';
  reason?: string;
  playerOut?: Player;
  playerIn?: Player;
  decision?: string;
}

export interface MatchStatistics {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  shotsOffTarget: { home: number; away: number };
  blockedShots: { home: number; away: number };
  corners: { home: number; away: number };
  offsides: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  saves: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  tackles: { home: number; away: number };
  attacks: { home: number; away: number };
  dangerousAttacks: { home: number; away: number };
  expectedGoals?: { home: number; away: number };
}

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  competition: {
    id: number;
    name: string;
    emblem?: string;
  };
  utcDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
  minute?: number;
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
    extraTime?: { home: number | null; away: number | null };
    penalties?: { home: number | null; away: number | null };
  };
  events: MatchEvent[];
  statistics?: MatchStatistics;
  homeLineup?: Lineup;
  awayLineup?: Lineup;
  venue?: string;
  attendance?: number;
  referee?: string;
}

export interface MomentumPoint {
  minute: number;
  value: number;
  event?: string;
}

export interface Prediction {
  id: string;
  type: 'next_scorer' | 'final_score' | 'next_card' | 'total_goals';
  question: string;
  options: string[];
  userPick?: string;
  correct?: boolean;
  points?: number;
}

export interface LiveMatchState {
  match: Match;
  momentum: MomentumPoint[];
  predictions: Prediction[];
  userScore: number;
}

export interface FootballDataResponse<T> {
  data: T;
  error?: string;
}