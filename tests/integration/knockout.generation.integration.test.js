jest.mock('../../src/dao/CompeticaoDAO', () => ({
    findById: jest.fn(),
    update: jest.fn()
}));

jest.mock('../../src/dao/UsuarioDAO', () => ({
    findById: jest.fn()
}));

jest.mock('../../src/dao/InscricaoCompeticaoDAO', () => ({
    findByCompeticaoId: jest.fn(),
    createIfNotExists: jest.fn()
}));

jest.mock('../../src/dao/AtletaDAO', () => ({
    findAll: jest.fn(),
    findManyByIds: jest.fn()
}));

jest.mock('../../src/dao/JogoDAO', () => ({
    findEliminatoriasByCompeticao: jest.fn(),
    createMany: jest.fn()
}));

jest.mock('../../src/dao/SetJogoDAO', () => ({
    findAllByJogoId: jest.fn()
}));

const CompeticaoDAO = require('../../src/dao/CompeticaoDAO');
const AtletaDAO = require('../../src/dao/AtletaDAO');
const JogoDAO = require('../../src/dao/JogoDAO');
const CompeticaoService = require('../../src/services/CompeticaoService');

function buildAthletes(total) {
    return Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        nome: `Atleta ${i + 1}`,
        rating_atual: 3000 - i * 10
    }));
}

function buildStandingsByQualifiedCount(totalQualified) {
    const ids = Array.from({ length: totalQualified }, (_, i) => i + 1);
    const standingsByGroup = {};

    let groupIndex = 1;
    for (let i = 0; i < ids.length; i += 2) {
        const groupId = `G${String(groupIndex).padStart(2, '0')}`;
        standingsByGroup[groupId] = [
            { atleta_id: ids[i], vitorias: 3, derrotas: 0, saldo_sets: 6, saldo_pontos: 25 },
            ids[i + 1]
                ? { atleta_id: ids[i + 1], vitorias: 2, derrotas: 1, saldo_sets: 2, saldo_pontos: 8 }
                : null
        ].filter(Boolean);
        groupIndex += 1;
    }

    return standingsByGroup;
}

describe('Knockout generation with BYE priority', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        CompeticaoDAO.findById.mockResolvedValue({ id: 1, tipo: 'SPING_FOODS', status: 'EM_ANDAMENTO' });
        JogoDAO.findEliminatoriasByCompeticao.mockResolvedValue([]);
        JogoDAO.createMany.mockImplementation(async (rows) => rows);
    });

    it.each([
        [2, 'FINAL', 1],
        [4, 'SEMI_FINAL', 2],
        [8, 'QUARTAS_FINAL', 4],
        [16, 'OITAVAS_FINAL', 8]
    ])('gera fase inicial correta para %i classificados', async (qualifiedCount, expectedPhase, expectedMatches) => {
        AtletaDAO.findAll.mockResolvedValue(buildAthletes(Math.max(qualifiedCount, 16)));
        jest
            .spyOn(CompeticaoService, 'finalizarGrupos')
            .mockResolvedValueOnce({ competicao_id: 1, standingsByGroup: buildStandingsByQualifiedCount(qualifiedCount) });

        const result = await CompeticaoService.gerarMataMata({ competitionId: 1 });

        expect(result.jogos).toHaveLength(expectedMatches);
        expect(result.jogos.every((j) => j.fase === expectedPhase)).toBe(true);
    });

    it('prioriza BYE para os atletas mais fortes (6 classificados => BYE seeds 1 e 2)', async () => {
        AtletaDAO.findAll.mockResolvedValue(buildAthletes(16));
        jest
            .spyOn(CompeticaoService, 'finalizarGrupos')
            .mockResolvedValueOnce({ competicao_id: 1, standingsByGroup: buildStandingsByQualifiedCount(6) });

        const result = await CompeticaoService.gerarMataMata({ competitionId: 1 });

        expect(result.jogos).toHaveLength(2);
        expect(result.jogos.every((j) => j.fase === 'QUARTAS_FINAL')).toBe(true);
        expect(result.jogos[0].observacoes).toContain('BYE_IDS:1,2');

        const pairKeys = result.jogos
            .map((j) => [j.atleta_a_id, j.atleta_b_id].sort((a, b) => a - b).join('-'))
            .sort();
        expect(pairKeys).toEqual(['3-6', '4-5']);
    });
});

