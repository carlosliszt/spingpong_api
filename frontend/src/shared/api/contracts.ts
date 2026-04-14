import type {
  AdminUser,
  Athlete,
  BracketMatch,
  Competition,
  CompetitionRegistration,
  GroupStanding,
  Match,
  MatchSet,
  RatingHistory,
  ResultHistory
} from '../types/domain';

export interface ApiServices {
  getUsers(): Promise<AdminUser[]>;
  createUser(payload: Partial<AdminUser> & { senha?: string }): Promise<AdminUser>;
  updateUser(id: number, payload: Partial<AdminUser> & { senha?: string }): Promise<AdminUser>;
  deleteUser(id: number): Promise<void>;

  getAthletes(): Promise<Athlete[]>;
  createAthlete(payload: Partial<Athlete>): Promise<Athlete>;
  updateAthlete(id: number, payload: Partial<Athlete>): Promise<Athlete>;
  deleteAthlete(id: number): Promise<void>;

  getCompetitions(): Promise<Competition[]>;
  createCompetition(payload: Partial<Competition>): Promise<Competition>;
  updateCompetition(id: number, payload: Partial<Competition>): Promise<Competition>;
  deleteCompetition(id: number): Promise<void>;

  getRegistrations(): Promise<CompetitionRegistration[]>;
  createRegistration(payload: Partial<CompetitionRegistration>): Promise<CompetitionRegistration>;
  updateRegistration(id: number, payload: Partial<CompetitionRegistration>): Promise<CompetitionRegistration>;
  deleteRegistration(id: number): Promise<void>;

  generateBalancedGroups(payload: { competitionId: number; athleteIds?: number[] }): Promise<unknown>;
  generateGroupMatches(payload: { competitionId: number }): Promise<unknown>;
  finalizeGroups(payload: { competitionId: number }): Promise<unknown>;
  generateKnockout(payload: { competitionId: number }): Promise<unknown>;

  getGroupStanding(competitionId: number, groupId: string): Promise<GroupStanding[]>;
  getBracket(competitionId: number): Promise<BracketMatch[]>;

  getMatches(): Promise<Match[]>;
  createMatch(payload: Partial<Match>): Promise<Match>;
  updateMatch(id: number, payload: Partial<Match>): Promise<Match>;
  deleteMatch(id: number): Promise<void>;
  registerMatchResult(payload: { jogoId: number; sets: MatchSet[]; vencedor_id?: number }): Promise<Match>;

  getSetsByMatch(jogoId: number): Promise<MatchSet[]>;
  createSet(payload: Partial<MatchSet>): Promise<MatchSet>;
  updateSet(id: number, payload: Partial<MatchSet>): Promise<MatchSet>;
  deleteSet(id: number): Promise<void>;

  getResultHistory(): Promise<ResultHistory[]>;
  createResultHistory(payload: Partial<ResultHistory>): Promise<ResultHistory>;
  updateResultHistory(id: number, payload: Partial<ResultHistory>): Promise<ResultHistory>;
  deleteResultHistory(id: number): Promise<void>;

  getRatingHistory(): Promise<RatingHistory[]>;
  createRatingHistory(payload: Partial<RatingHistory>): Promise<RatingHistory>;
  updateRatingHistory(id: number, payload: Partial<RatingHistory>): Promise<RatingHistory>;
  deleteRatingHistory(id: number): Promise<void>;
}

