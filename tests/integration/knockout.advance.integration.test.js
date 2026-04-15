jest.mock('../../src/dao/JogoDAO', () => ({
	findByCompeticaoAndFase: jest.fn(),
	findEliminatoriasByCompeticao: jest.fn(),
	createMany: jest.fn()
}));

jest.mock('../../src/dao/CompeticaoDAO', () => ({
	findById: jest.fn(),
	update: jest.fn()
}));

jest.mock('../../src/dao/AtletaDAO', () => ({
	addRankingPoints: jest.fn(),
	findById: jest.fn()
}));

jest.mock('../../src/dao/SetJogoDAO', () => ({
	replaceSetsForJogo: jest.fn(),
	findAllByJogoId: jest.fn()
}));

const JogoDAO = require('../../src/dao/JogoDAO');
const JogoService = require('../../src/services/JogoService');

function finishedMatch(id, fase, rodada, vencedorId, observacoes = null) {
	return {
		id,
		competicao_id: 1,
		fase,
		rodada,
		atleta_a_id: vencedorId,
		atleta_b_id: vencedorId + 100,
		vencedor_id: vencedorId,
		status: 'FINALIZADO',
		observacoes
	};
}

describe('Knockout advance flow', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		JogoDAO.createMany.mockResolvedValue([]);
	});

	it('avanca OITAVAS -> QUARTAS com 8 vencedores (4 jogos)', async () => {
		const phaseMatches = Array.from({ length: 8 }, (_, i) =>
			finishedMatch(i + 1, 'OITAVAS_FINAL', i + 1, i + 1)
		);

		JogoDAO.findByCompeticaoAndFase.mockResolvedValueOnce(phaseMatches).mockResolvedValueOnce([]);

		await JogoService._advanceKnockoutIfNeeded({ competicao_id: 1, fase: 'OITAVAS_FINAL' });

		expect(JogoDAO.createMany).toHaveBeenCalledTimes(1);
		const created = JogoDAO.createMany.mock.calls[0][0];
		expect(created).toHaveLength(4);
		expect(created.every((m) => m.fase === 'QUARTAS_FINAL')).toBe(true);
	});

	it('avanca QUARTAS -> SEMI com 4 vencedores (2 jogos)', async () => {
		const phaseMatches = Array.from({ length: 4 }, (_, i) =>
			finishedMatch(i + 1, 'QUARTAS_FINAL', i + 1, i + 1)
		);

		JogoDAO.findByCompeticaoAndFase.mockResolvedValueOnce(phaseMatches).mockResolvedValueOnce([]);

		await JogoService._advanceKnockoutIfNeeded({ competicao_id: 1, fase: 'QUARTAS_FINAL' });

		const created = JogoDAO.createMany.mock.calls[0][0];
		expect(created).toHaveLength(2);
		expect(created.every((m) => m.fase === 'SEMI_FINAL')).toBe(true);
	});

	it('avanca SEMI -> FINAL com 2 vencedores (1 jogo)', async () => {
		const phaseMatches = [
			finishedMatch(1, 'SEMI_FINAL', 1, 1),
			finishedMatch(2, 'SEMI_FINAL', 2, 2)
		];

		JogoDAO.findByCompeticaoAndFase.mockResolvedValueOnce(phaseMatches).mockResolvedValueOnce([]);

		await JogoService._advanceKnockoutIfNeeded({ competicao_id: 1, fase: 'SEMI_FINAL' });

		const created = JogoDAO.createMany.mock.calls[0][0];
		expect(created).toHaveLength(1);
		expect(created[0].fase).toBe('FINAL');
	});

	it('com 6 classificados, gera 2 semifinais apos quartas com 2 BYEs', async () => {
		const phaseMatches = [
			finishedMatch(31, 'QUARTAS_FINAL', 3, 3, 'BYE_IDS:1,2'),
			finishedMatch(32, 'QUARTAS_FINAL', 4, 4, 'BYE_IDS:1,2')
		];

		JogoDAO.findByCompeticaoAndFase.mockResolvedValueOnce(phaseMatches).mockResolvedValueOnce([]);

		await JogoService._advanceKnockoutIfNeeded({ competicao_id: 1, fase: 'QUARTAS_FINAL' });

		const created = JogoDAO.createMany.mock.calls[0][0];
		expect(created).toHaveLength(2);
		expect(created.every((m) => m.fase === 'SEMI_FINAL')).toBe(true);
	});
});

