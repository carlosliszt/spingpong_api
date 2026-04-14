import type { ApiServices } from './contracts';
import { http } from './http';
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

type ApiResponse<T> = { success: boolean; data: T };

export const services: ApiServices = {
  async getUsers() {
    const { data } = await http.get<ApiResponse<AdminUser[]>>('/usuarios');
    return data.data ?? [];
  },
  async createUser(payload) {
    const { data } = await http.post<ApiResponse<AdminUser>>('/usuarios', payload);
    return data.data;
  },
  async updateUser(id, payload) {
    const { data } = await http.put<ApiResponse<AdminUser>>(`/usuarios/${id}`, payload);
    return data.data;
  },
  async deleteUser(id) {
    await http.delete(`/usuarios/${id}`);
  },

  async getAthletes() {
    const { data } = await http.get<ApiResponse<Athlete[]>>('/atletas');
    return data.data ?? [];
  },
  async createAthlete(payload) {
    const { data } = await http.post<ApiResponse<Athlete>>('/atletas', payload);
    return data.data;
  },
  async updateAthlete(id, payload) {
    const { data } = await http.put<ApiResponse<Athlete>>(`/atletas/${id}`, payload);
    return data.data;
  },
  async deleteAthlete(id) {
    await http.delete(`/atletas/${id}`);
  },

  async getCompetitions() {
    const { data } = await http.get<ApiResponse<Competition[]>>('/competicoes');
    return data.data ?? [];
  },
  async createCompetition(payload) {
    const { data } = await http.post<ApiResponse<Competition>>('/competicoes', payload);
    return data.data;
  },
  async updateCompetition(id, payload) {
    const { data } = await http.put<ApiResponse<Competition>>(`/competicoes/${id}`, payload);
    return data.data;
  },
  async deleteCompetition(id) {
    await http.delete(`/competicoes/${id}`);
  },

  async getRegistrations() {
    const { data } = await http.get<ApiResponse<CompetitionRegistration[]>>('/inscricoes');
    return data.data ?? [];
  },
  async createRegistration(payload) {
    const { data } = await http.post<ApiResponse<CompetitionRegistration>>('/inscricoes', payload);
    return data.data;
  },
  async updateRegistration(id, payload) {
    const { data } = await http.put<ApiResponse<CompetitionRegistration>>(`/inscricoes/${id}`, payload);
    return data.data;
  },
  async deleteRegistration(id) {
    await http.delete(`/inscricoes/${id}`);
  },

  async generateBalancedGroups(payload) {
    const { data } = await http.post('/competicoes/gerar-grupos-balanceados', payload);
    return data;
  },
  async generateGroupMatches(payload) {
    const { data } = await http.post('/competicoes/gerar-jogos-grupo', payload);
    return data;
  },
  async finalizeGroups(payload) {
    const { data } = await http.post('/competicoes/finalizar-grupos', payload);
    return data;
  },
  async generateKnockout(payload) {
    const { data } = await http.post('/competicoes/gerar-mata-mata', payload);
    return data;
  },

  async getGroupStanding(competitionId, groupId) {
    const { data } = await http.get<ApiResponse<GroupStanding[]>>(`/competicoes/${competitionId}/classificacao-grupo/${groupId}`);
    return data.data ?? [];
  },
  async getBracket(competitionId) {
    const { data } = await http.get<ApiResponse<any[]>>(`/competicoes/${competitionId}/bracket`);
    const rows = data.data ?? [];
    return rows.map((row) => ({
      id: String(row.id),
      round: row.round,
      slot: Number(row.slot || 0),
      a: row.atleta_a_id
        ? {
            seed: Number(row.atleta_a_id),
            atleta: {
              id: Number(row.atleta_a_id),
              nome: row.atleta_a_nome ?? `Atleta ${row.atleta_a_id}`,
              rating_atual: 0,
              faixa_rating: 'O',
              ativo: 1
            }
          }
        : undefined,
      b: row.atleta_b_id
        ? {
            seed: Number(row.atleta_b_id),
            atleta: {
              id: Number(row.atleta_b_id),
              nome: row.atleta_b_nome ?? `Atleta ${row.atleta_b_id}`,
              rating_atual: 0,
              faixa_rating: 'O',
              ativo: 1
            }
          }
        : undefined
    }));
  },

  async getMatches() {
    const { data } = await http.get<ApiResponse<Match[]>>('/jogos');
    return data.data ?? [];
  },
  async createMatch(payload) {
    const { data } = await http.post<ApiResponse<Match>>('/jogos', payload);
    return data.data;
  },
  async updateMatch(id, payload) {
    const { data } = await http.put<ApiResponse<Match>>(`/jogos/${id}`, payload);
    return data.data;
  },
  async deleteMatch(id) {
    await http.delete(`/jogos/${id}`);
  },
  async registerMatchResult(payload: { jogoId: number; sets: MatchSet[]; vencedor_id?: number }) {
    const { data } = await http.post<ApiResponse<Match>>('/jogos/registrar-resultado-jogo', payload);
    return data.data;
  },

  async getSetsByMatch(jogoId) {
    const { data } = await http.get<ApiResponse<MatchSet[]>>(`/jogos/${jogoId}/sets`);
    return data.data ?? [];
  },
  async createSet(payload) {
    const normalized = {
      ...payload,
      pontos_atleta_a: payload.pontos_atleta_a ?? payload.pontos_a,
      pontos_atleta_b: payload.pontos_atleta_b ?? payload.pontos_b
    };
    const { data } = await http.post<ApiResponse<MatchSet>>('/jogos/sets', normalized);
    return data.data;
  },
  async updateSet(id, payload) {
    const normalized = {
      ...payload,
      pontos_atleta_a: payload.pontos_atleta_a ?? payload.pontos_a,
      pontos_atleta_b: payload.pontos_atleta_b ?? payload.pontos_b
    };
    const { data } = await http.put<ApiResponse<MatchSet>>(`/jogos/sets/${id}`, normalized);
    return data.data;
  },
  async deleteSet(id) {
    await http.delete(`/jogos/sets/${id}`);
  },

  async getResultHistory() {
    const { data } = await http.get<ApiResponse<ResultHistory[]>>('/historicos/resultados');
    return data.data ?? [];
  },
  async createResultHistory(payload) {
    const { data } = await http.post<ApiResponse<ResultHistory>>('/historicos/resultados', payload);
    return data.data;
  },
  async updateResultHistory(id, payload) {
    const { data } = await http.put<ApiResponse<ResultHistory>>(`/historicos/resultados/${id}`, payload);
    return data.data;
  },
  async deleteResultHistory(id) {
    await http.delete(`/historicos/resultados/${id}`);
  },

  async getRatingHistory() {
    const { data } = await http.get<ApiResponse<RatingHistory[]>>('/historicos/rating');
    return data.data ?? [];
  },
  async createRatingHistory(payload) {
    const { data } = await http.post<ApiResponse<RatingHistory>>('/historicos/rating', payload);
    return data.data;
  },
  async updateRatingHistory(id, payload) {
    const { data } = await http.put<ApiResponse<RatingHistory>>(`/historicos/rating/${id}`, payload);
    return data.data;
  },
  async deleteRatingHistory(id) {
    await http.delete(`/historicos/rating/${id}`);
  }
};
