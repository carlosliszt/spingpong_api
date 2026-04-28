import type { ApiServices } from './contracts';
import { http } from './http';
import type {
  AdminUser,
  Athlete,
  Competition,
  CompetitionRegistration,
  GroupStanding,
  Match,
  MatchSet,
  RatingHistory,
  ResultHistory,
  SpingOpenConfig
} from '../types/domain';

type ApiResponse<T> = { success: boolean; data: T };

const unwrapResponse = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as any) && (payload as any).data !== undefined) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

const parsePositions = (positions: unknown): number[] => {
  if (Array.isArray(positions)) {
    return positions.map((item) => Number(item)).filter((item) => Number.isFinite(item) && item > 0).sort((a, b) => a - b);
  }

  if (typeof positions === 'string') {
    return positions
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item) && item > 0)
      .sort((a, b) => a - b);
  }

  return [];
};

const normalizeSpingOpenConfig = (raw: any): SpingOpenConfig => ({
  id: Number(raw.id),
  nome: String(raw.nome ?? ''),
  descricao: raw.descricao ?? null,
  atletas_por_grupo: Number(raw.atletas_por_grupo ?? 5),
  posicoes_nivel_a: parsePositions(raw.posicoes_nivel_a),
  posicoes_nivel_b: parsePositions(raw.posicoes_nivel_b),
  posicoes_nivel_c: parsePositions(raw.posicoes_nivel_c),
  posicoes_nivel_d: parsePositions(raw.posicoes_nivel_d),
  ativo: Number(raw.ativo ?? 0),
  padrao: Number(raw.padrao ?? 0),
  created_at: raw.created_at,
  updated_at: raw.updated_at
});

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
  async updateMatchResult(payload: { jogoId: number; sets: MatchSet[]; vencedor_id?: number }) {
    const { data } = await http.put<ApiResponse<Match>>('/jogos/atualizar-resultado-jogo', payload);
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
  },

  async getSpingOpenConfigs() {
    const { data } = await http.get<ApiResponse<any[]> | any[]>('/sping-open-config');
    const rows = unwrapResponse<any[]>(data) ?? [];
    return rows.map(normalizeSpingOpenConfig);
  },
  async getSpingOpenConfigById(id) {
    const { data } = await http.get<ApiResponse<any> | any>(`/sping-open-config/${id}`);
    return normalizeSpingOpenConfig(unwrapResponse<any>(data));
  },
  async getDefaultSpingOpenConfig() {
    const { data } = await http.get<ApiResponse<any> | any>('/sping-open-config/default');
    return normalizeSpingOpenConfig(unwrapResponse<any>(data));
  },
  async getActiveSpingOpenConfig() {
    const { data } = await http.get<ApiResponse<any> | any>('/sping-open-config/active');
    return normalizeSpingOpenConfig(unwrapResponse<any>(data));
  },
  async createSpingOpenConfig(payload) {
    const normalizedPayload = {
      ...payload,
      posicoes_nivel_a: Array.isArray(payload.posicoes_nivel_a) ? payload.posicoes_nivel_a.join(',') : payload.posicoes_nivel_a,
      posicoes_nivel_b: Array.isArray(payload.posicoes_nivel_b) ? payload.posicoes_nivel_b.join(',') : payload.posicoes_nivel_b,
      posicoes_nivel_c: Array.isArray(payload.posicoes_nivel_c) ? payload.posicoes_nivel_c.join(',') : payload.posicoes_nivel_c,
      posicoes_nivel_d: Array.isArray(payload.posicoes_nivel_d) ? payload.posicoes_nivel_d.join(',') : payload.posicoes_nivel_d
    };
    const { data } = await http.post<ApiResponse<any> | any>('/sping-open-config', normalizedPayload);
    return normalizeSpingOpenConfig(unwrapResponse<any>(data));
  },
  async updateSpingOpenConfig(id, payload) {
    const normalizedPayload = {
      ...payload,
      posicoes_nivel_a: Array.isArray(payload.posicoes_nivel_a) ? payload.posicoes_nivel_a.join(',') : payload.posicoes_nivel_a,
      posicoes_nivel_b: Array.isArray(payload.posicoes_nivel_b) ? payload.posicoes_nivel_b.join(',') : payload.posicoes_nivel_b,
      posicoes_nivel_c: Array.isArray(payload.posicoes_nivel_c) ? payload.posicoes_nivel_c.join(',') : payload.posicoes_nivel_c,
      posicoes_nivel_d: Array.isArray(payload.posicoes_nivel_d) ? payload.posicoes_nivel_d.join(',') : payload.posicoes_nivel_d
    };
    const { data } = await http.put<ApiResponse<any> | any>(`/sping-open-config/${id}`, normalizedPayload);
    return normalizeSpingOpenConfig(unwrapResponse<any>(data));
  },
  async deleteSpingOpenConfig(id) {
    await http.delete(`/sping-open-config/${id}`);
  }
};
