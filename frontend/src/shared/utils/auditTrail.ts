import { services } from '@/shared/api/services';
import type { Match } from '@/shared/types/domain';

/**
 * Registra uma mudança de resultado no histórico
 * @param oldMatch Match original com sets antigos
 * @param newMatch Match após alteração
 * @param userId ID do usuário que fez a alteração
 */
export async function recordMatchResultChange(
  oldMatch: Match,
  newMatch: Match,
  userId?: number
) {
  try {
    // Calcula vencedores
    const oldWinsA = (oldMatch.sets ?? []).filter((s) => (s.pontos_a ?? 0) > (s.pontos_b ?? 0)).length;
    const newWinsA = (newMatch.sets ?? []).filter((s) => (s.pontos_a ?? 0) > (s.pontos_b ?? 0)).length;

    const oldVencedorId = oldWinsA > (oldMatch.sets?.length ?? 0) / 2 ? oldMatch.atleta_a_id : oldMatch.atleta_b_id;
    const newVencedorId = newWinsA > (newMatch.sets?.length ?? 0) / 2 ? newMatch.atleta_a_id : newMatch.atleta_b_id;

    // Registra no histórico de resultados
    await services.createResultHistory({
      jogo_id: newMatch.id,
      status_anterior: oldMatch.status,
      status_novo: newMatch.status,
      vencedor_anterior_id: oldVencedorId,
      vencedor_novo_id: newVencedorId,
      alterado_por: userId ?? 0,
      motivo: 'Resultado alterado manualmente',
      competicao_id: newMatch.competicao_id
    });

    console.log('✓ Mudança de resultado registrada no histórico');
  } catch (error) {
    console.error('Erro ao registrar mudança:', error);
    // Não lança erro, apenas registra no console
  }
}

/**
 * Formata a data de um histórico para exibição
 */
export function formatHistoryDate(dateStr?: string): string {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR');
}

/**
 * Mapeia status de mudança para label legível
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    'AGENDADO': '📅 Agendado',
    'EM_ANDAMENTO': '🎮 Em Andamento',
    'FINALIZADO': '✓ Finalizado',
    'CANCELADO': '✗ Cancelado',
    'W_O': '🚫 W.O.'
  };
  return map[status] ?? status;
}

