export type CompetitionType = 'SPING_OPEN' | 'SPING_FOODS';
export type CompetitionStatus = 'PLANEJADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA';
export type MatchStatus = 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'W_O' | 'CANCELADO';

export type Athlete = {
  id: number;
  nome: string;
  data_nascimento?: string | null;
  sexo?: string | null;
  email?: string | null;
  telefone?: string | null;
  ativo: number;
  rating_atual: number;
  faixa_rating: string;
  ranking_posicao?: number | null;
  partidas_jogadas?: number;
  vitorias?: number;
  derrotas?: number;
  created_at?: string;
  updated_at?: string;
};

export type AdminUser = {
  id: number;
  nome: string;
  email: string;
  papel?: string;
  ativo?: number;
  created_at?: string;
  updated_at?: string;
};

export type Competition = {
  id: number;
  nome: string;
  tipo: CompetitionType;
  status: CompetitionStatus;
  data_inicio: string;
  data_fim?: string | null;
  local?: string | null;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
};

export type CompetitionRegistration = {
  id: number;
  competicao_id: number;
  atleta_id: number;
  seed_num?: number | null;
  status: 'INSCRITO' | 'CONFIRMADO' | 'CANCELADO';
  created_at?: string;
  competicao_nome?: string;
  atleta_nome?: string;
};

export type SpingOpenConfig = {
  id: number;
  nome: string;
  descricao?: string | null;
  atletas_por_grupo: number;
  posicoes_nivel_a: number[];
  posicoes_nivel_b: number[];
  posicoes_nivel_c: number[];
  posicoes_nivel_d: number[];
  ativo: number;
  padrao: number;
  created_at?: string;
  updated_at?: string;
};

export type MatchSet = {
  id?: number;
  jogo_id: number;
  numero_set: number;
  pontos_a?: number;
  pontos_b?: number;
  pontos_atleta_a?: number;
  pontos_atleta_b?: number;
  vencedor_set_id?: number | null;
  created_at?: string;
};

export type Match = {
  id: number;
  competicao_id: number;
  competicao_nome?: string;
  fase: string;
  rodada?: number | null;
  grupo_id?: string | null;
  atleta_a_id: number;
  atleta_a_nome?: string;
  atleta_b_id: number;
  atleta_b_nome?: string;
  vencedor_id?: number | null;
  vencedor_nome?: string;
  status: MatchStatus;
  data_hora_prevista?: string | null;
  data_hora_inicio?: string | null;
  data_hora_fim?: string | null;
  observacoes?: string | null;
  created_at?: string;
  updated_at?: string;
  sets?: MatchSet[];
};

export type GroupStanding = {
  grupo_id: string;
  atleta_id: number;
  nome_atleta?: string;
  vitorias: number;
  derrotas: number;
  saldo_sets: number;
  saldo_pontos: number;
  posicao?: number;
};

export type ResultHistory = {
  id: number;
  jogo_id: number;
  status_anterior?: string | null;
  status_novo: string;
  vencedor_anterior_id?: number | null;
  vencedor_anterior_nome?: string | null;
  vencedor_novo_id?: number | null;
  vencedor_novo_nome?: string | null;
  alterado_por: number;
  motivo?: string | null;
  created_at?: string;
  competicao_id?: number;
};

export type RatingHistory = {
  id: number;
  atleta_id: number;
  jogo_id?: number | null;
  rating_anterior: number;
  rating_novo: number;
  ranking_anterior?: number | null;
  ranking_novo?: number | null;
  motivo?: string | null;
  alterado_por?: number | null;
  created_at?: string;
  atleta_nome?: string;
};

export type BracketEntry = {
  seed: number;
  atleta?: Athlete;
  bye?: boolean;
};

export type BracketMatch = {
  id: string;
  round: string | number;
  slot: number;
  a?: BracketEntry;
  b?: BracketEntry;
  winnerSeed?: number;
};
