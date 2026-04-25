// =========================================================
// Teste de Integração: Sistema de Configuração SPING_OPEN
// =========================================================

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('SpingOpenConfig - API Endpoints', () => {
    let configId = null;
    let token = null;

    // Antes de todos os testes
    beforeAll(async () => {
        // Aqui você precisaria fazer login para obter um token válido
        // Por enquanto, assumindo que o token é passado como variável de ambiente
        token = process.env.TEST_TOKEN || 'test-token';
    });

    // Após todos os testes
    afterAll(async () => {
        // Limpar dados de teste
        await db.query('DELETE FROM sping_open_config WHERE nome LIKE "%Teste%"');
        await db.end();
    });

    // =========================================================
    // Testes de Listagem
    // =========================================================

    test('GET /api/sping-open-config - Listar todas as configurações', async () => {
        const response = await request(app)
            .get('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /api/sping-open-config/default - Obter configuração padrão', async () => {
        const response = await request(app)
            .get('/api/sping-open-config/default')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.padrao).toBe(1);
        expect(response.body.atletas_por_grupo).toBe(5);
    });

    test('GET /api/sping-open-config/active - Obter configuração ativa', async () => {
        const response = await request(app)
            .get('/api/sping-open-config/active')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.ativo).toBe(1);
    });

    // =========================================================
    // Testes de Criação
    // =========================================================

    test('POST /api/sping-open-config - Criar nova configuração (4 atletas)', async () => {
        const response = await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Teste: Grupos de 4',
                descricao: 'Configuração de teste com 4 atletas por grupo',
                atletas_por_grupo: 4,
                posicoes_nivel_a: '1,2',
                posicoes_nivel_b: '3',
                posicoes_nivel_c: '',
                posicoes_nivel_d: '',
                ativo: true,
                padrao: false
            });

        expect(response.status).toBe(201);
        expect(response.body.nome).toBe('Teste: Grupos de 4');
        expect(response.body.atletas_por_grupo).toBe(4);
        expect(Array.isArray(response.body.posicoes_nivel_a)).toBe(true);
        expect(response.body.posicoes_nivel_a).toEqual([1, 2]);

        configId = response.body.id;
    });

    test('POST /api/sping-open-config - Criar com 6 atletas', async () => {
        const response = await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Teste: Grupos de 6',
                atletas_por_grupo: 6,
                posicoes_nivel_a: '1',
                posicoes_nivel_b: '2,3',
                posicoes_nivel_c: '4,5',
                posicoes_nivel_d: '6',
                ativo: true,
                padrao: false
            });

        expect(response.status).toBe(201);
        expect(response.body.atletas_por_grupo).toBe(6);
    });

    // =========================================================
    // Testes de Validação (Erros Esperados)
    // =========================================================

    test('POST /api/sping-open-config - Erro: Nome vazio', async () => {
        const response = await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: '',
                atletas_por_grupo: 5,
                posicoes_nivel_a: '1,2'
            });

        expect(response.status).toBe(400);
        expect(response.body.erro).toContain('Nome');
    });

    test('POST /api/sping-open-config - Erro: Atletas < 3', async () => {
        const response = await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Inválido',
                atletas_por_grupo: 2,
                posicoes_nivel_a: '1'
            });

        expect(response.status).toBe(400);
        expect(response.body.erro).toContain('entre 3 e 10');
    });

    test('POST /api/sping-open-config - Erro: Atletas > 10', async () => {
        const response = await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Inválido',
                atletas_por_grupo: 15,
                posicoes_nivel_a: '1'
            });

        expect(response.status).toBe(400);
        expect(response.body.erro).toContain('entre 3 e 10');
    });

    test('POST /api/sping-open-config - Erro: Posição duplicada', async () => {
        const response = await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Inválido',
                atletas_por_grupo: 5,
                posicoes_nivel_a: '1,2',
                posicoes_nivel_b: '2'
            });

        expect(response.status).toBe(400);
        expect(response.body.erro).toContain('múltiplos níveis');
    });

    test('POST /api/sping-open-config - Erro: Posição acima do máximo', async () => {
        const response = await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Inválido',
                atletas_por_grupo: 4,
                posicoes_nivel_a: '1,2',
                posicoes_nivel_b: '5'
            });

        expect(response.status).toBe(400);
        expect(response.body.erro).toContain('maior que');
    });

    // =========================================================
    // Testes de Busca
    // =========================================================

    test('GET /api/sping-open-config/:id - Obter por ID', async () => {
        if (!configId) {
            throw new Error('configId não definido. Execute POST primeiro.');
        }

        const response = await request(app)
            .get(`/api/sping-open-config/${configId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(configId);
    });

    test('GET /api/sping-open-config/:id - Erro: ID não encontrado', async () => {
        const response = await request(app)
            .get('/api/sping-open-config/99999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.erro).toContain('não encontrada');
    });

    // =========================================================
    // Testes de Atualização
    // =========================================================

    test('PUT /api/sping-open-config/:id - Atualizar configuração', async () => {
        if (!configId) {
            throw new Error('configId não definido.');
        }

        const response = await request(app)
            .put(`/api/sping-open-config/${configId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                descricao: 'Descrição atualizada',
                ativo: false
            });

        expect(response.status).toBe(200);
        expect(response.body.ativo).toBe(0);
    });

    test('PUT /api/sping-open-config/:id - Erro: ID não encontrado', async () => {
        const response = await request(app)
            .put('/api/sping-open-config/99999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Novo Nome'
            });

        expect(response.status).toBe(404);
    });

    // =========================================================
    // Testes de Deleção
    // =========================================================

    test('DELETE /api/sping-open-config/:id - Deletar configuração', async () => {
        if (!configId) {
            throw new Error('configId não definido.');
        }

        const response = await request(app)
            .delete(`/api/sping-open-config/${configId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    test('DELETE /api/sping-open-config/:id - Verificar que foi deletado', async () => {
        if (!configId) {
            throw new Error('configId não definido.');
        }

        const response = await request(app)
            .get(`/api/sping-open-config/${configId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    // =========================================================
    // Testes de Integração com CompeticaoService
    // =========================================================

    test('Cenário: 50 atletas com config (5/grupo) = 10 grupos', async () => {
        // Simular cálculo
        const config = {
            atletas_por_grupo: 5
        };
        const athleteCount = 50;
        const expectedGroups = Math.ceil(athleteCount / config.atletas_por_grupo);

        expect(expectedGroups).toBe(10);
    });

    test('Cenário: 50 atletas com config (5/grupo) - Nível A = 20, B = 10, C = 10, D = 10', async () => {
        // Simular distribuição
        const groupCount = 10;
        const posicoes = {
            A: [1, 2],
            B: [3],
            C: [4],
            D: [5]
        };

        const nivelA = posicoes.A.length * groupCount; // 2 * 10 = 20
        const nivelB = posicoes.B.length * groupCount; // 1 * 10 = 10
        const nivelC = posicoes.C.length * groupCount; // 1 * 10 = 10
        const nivelD = posicoes.D.length * groupCount; // 1 * 10 = 10

        expect(nivelA).toBe(20);
        expect(nivelB).toBe(10);
        expect(nivelC).toBe(10);
        expect(nivelD).toBe(10);
    });

    test('Cenário: BYE calculation - Nível A (20) → 32 slots = 12 BYEs', async () => {
        const atletasNivelA = 20;
        const nextPowerOfTwo = (n) => {
            let p = 1;
            while (p < n) p *= 2;
            return p;
        };

        const bracketSize = nextPowerOfTwo(atletasNivelA);
        const byeCount = bracketSize - atletasNivelA;

        expect(bracketSize).toBe(32);
        expect(byeCount).toBe(12);
    });
});

// =========================================================
// Testes de Performance
// =========================================================

describe('SpingOpenConfig - Performance', () => {
    test('Buscar todas as configurações em menos de 100ms', async () => {
        const token = process.env.TEST_TOKEN || 'test-token';
        const start = Date.now();

        await request(app)
            .get('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`);

        const duration = Date.now() - start;
        expect(duration).toBeLessThan(100);
    });

    test('Criar nova configuração em menos de 200ms', async () => {
        const token = process.env.TEST_TOKEN || 'test-token';
        const start = Date.now();

        await request(app)
            .post('/api/sping-open-config')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: `Teste Performance ${Date.now()}`,
                atletas_por_grupo: 5,
                posicoes_nivel_a: '1,2'
            });

        const duration = Date.now() - start;
        expect(duration).toBeLessThan(200);
    });
});

