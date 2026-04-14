# Spingpong API

API REST em Node.js + Express + MySQL para gestao de usuarios administradores, atletas, competicoes, inscricoes, jogos e historicos de rating/resultado.

## Stack

- Node.js + Express
- MySQL 8+ (`mysql2`)
- JWT (`jsonwebtoken`)
- Validacao com `express-validator`
- Testes de integracao com `jest` + `supertest`

## Instalacao

```bash
npm install
```

## Configuracao

1. Execute o schema em `docs/schema.sql`.
2. Configure variaveis de ambiente:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=spingpong

JWT_SECRET=chave_super_secreta
JWT_EXPIRES_IN=1d
```

## Executar

```bash
npm run dev
npm start
```

## Endpoints principais

Base URL: `http://localhost:3000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (protegido)

### Usuarios (protegido)
- `GET /usuarios`
- `GET /usuarios/:id`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`

### Atletas
- `GET /atletas`
- `GET /atletas/ranking`
- `GET /atletas/:id`
- `POST /atletas` (protegido)
- `PUT /atletas/:id` (protegido)
- `DELETE /atletas/:id` (protegido)

### Competicoes
- `GET /competicoes`
- `GET /competicoes/:id`
- `POST /competicoes` (protegido)
- `PUT /competicoes/:id` (protegido)
- `DELETE /competicoes/:id` (protegido)

### Inscricoes (protegido)
- `GET /inscricoes`
- `GET /inscricoes/:id`
- `POST /inscricoes`
- `PUT /inscricoes/:id`
- `DELETE /inscricoes/:id`

### Jogos
- `GET /jogos`
- `GET /jogos/:id`
- `GET /jogos/:jogoId/sets`
- `POST /jogos` (protegido)
- `PUT /jogos/:id` (protegido)
- `DELETE /jogos/:id` (protegido)
- `POST /jogos/sets` (protegido)
- `PUT /jogos/sets/:id` (protegido)
- `DELETE /jogos/sets/:id` (protegido)

### Historicos (protegido)
- `GET /historicos/resultados?jogo_id=1`
- `GET /historicos/rating?atleta_id=1`

## Testes

Suite minima de integracao para `auth`, `atletas`, `competicoes` e `jogos` em `tests/integration/api.integration.test.js`.

```bash
npm test
```

## Colecoes

As colecoes atualizadas estao em:
- `docs/postman_collection.json`
- `docs/insomnia_collection.json`

