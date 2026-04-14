const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/config/database', () => ({
    query: jest.fn(async () => [[]]),
    getConnection: jest.fn(async () => ({ release: jest.fn() }))
}));

jest.mock('../../src/services/AuthService', () => ({
    register: jest.fn(),
    login: jest.fn()
}));

jest.mock('../../src/services/AtletaService', () => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    getRanking: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    rankingAtual: jest.fn()
}));

jest.mock('../../src/services/CompeticaoService', () => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

jest.mock('../../src/services/JogoService', () => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

const app = require('../../src/app');
const AuthService = require('../../src/services/AuthService');
const AtletaService = require('../../src/services/AtletaService');
const CompeticaoService = require('../../src/services/CompeticaoService');
const JogoService = require('../../src/services/JogoService');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const makeToken = () => jwt.sign({ id: 1, email: 'admin@spingpong.com', papel: 'ADMIN' }, process.env.JWT_SECRET);

describe('Integration - core endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('auth', () => {
        it('POST /api/auth/login should return 200', async () => {
            AuthService.login.mockResolvedValue({
                usuario: { id: 1, nome: 'Admin', email: 'admin@spingpong.com', papel: 'ADMIN', ativo: 1 },
                token: 'jwt-token'
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'admin@spingpong.com', senha: '123456' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(AuthService.login).toHaveBeenCalledWith('admin@spingpong.com', '123456');
        });
    });

    describe('atletas', () => {
        it('GET /api/atletas should return 200', async () => {
            AtletaService.getAll.mockResolvedValue([{ id: 1, nome: 'Atleta 1' }]);

            const response = await request(app).get('/api/atletas');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
        });

        it('POST /api/atletas should return 201 when authenticated', async () => {
            AtletaService.create.mockResolvedValue({ id: 2, nome: 'Novo Atleta' });

            const response = await request(app)
                .post('/api/atletas')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send({ nome: 'Novo Atleta' });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(AtletaService.create).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Novo Atleta' }));
        });
    });

    describe('competicoes', () => {
        it('POST /api/competicoes should return 201 when authenticated', async () => {
            CompeticaoService.create.mockResolvedValue({ id: 10, nome: 'Open 2026', tipo: 'SPING_OPEN' });

            const response = await request(app)
                .post('/api/competicoes')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send({ nome: 'Open 2026', tipo: 'SPING_OPEN', data_inicio: '2026-05-01' });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(CompeticaoService.create).toHaveBeenCalled();
        });
    });

    describe('jogos', () => {
        it('POST /api/jogos should return 201 when authenticated', async () => {
            JogoService.create.mockResolvedValue({
                id: 100,
                competicao_id: 10,
                fase: 'GRUPOS',
                atleta_a_id: 1,
                atleta_b_id: 2,
                status: 'AGENDADO'
            });

            const response = await request(app)
                .post('/api/jogos')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send({
                    competicao_id: 10,
                    fase: 'GRUPOS',
                    atleta_a_id: 1,
                    atleta_b_id: 2
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(JogoService.create).toHaveBeenCalled();
        });
    });
});

