# Frontend Spingpong (React + TypeScript + Vite)

Frontend administrativo para gestao de atletas, competicoes e jogos de tenis de mesa, consumindo a API existente em `http://localhost:3000/api`.

## Rodar localmente

```bash
cd frontend
npm install
npm run dev
```

Build de producao:

```bash
cd frontend
npm run build
npm run preview
```

Testes unitarios das regras de negocio:

```bash
cd frontend
npm test
```

## Estrutura de pastas

```text
frontend/
  src/
    app/
      layout/
      queryClient.ts
      router.tsx
    features/
      auth/
      competition-engine/
      competitions/
      matches/
    pages/
    shared/
      api/
      components/
      lib/
      store/
      types/
```

## Decisoes arquiteturais

- **Arquitetura por features**: regras criticas de torneio ficam em `features/competition-engine`.
- **UI desacoplada de regra**: balanceamento, niveis A/B/C/D e bracket com BYE em use-cases TS puros.
- **Dados remotos**: TanStack Query para cache e mutacoes.
- **Formularios**: React Hook Form + Zod.
- **Estado global leve**: Zustand para sessao admin (token + usuario).
- **Acessibilidade**: labels, `aria-label` em componentes principais e confirmacao para acoes destrutivas.

## Pontos de extensao para backend real

- Endpoints ja previstos na camada tipada em `src/shared/api/contracts.ts` e implementados em `src/shared/api/services.ts`.
- Operacoes ainda nao expostas pela API atual (ex.: gerar grupos/bracket) ja possuem contratos preparados.
- Substituir mocks visuais das telas por respostas reais sem alterar os componentes de apresentacao.

## Regras implementadas

Arquivo: `src/features/competition-engine/useCases.ts`

- `snakeGroupIndexes`: distribuicao snake (1..N, N..1, repetindo).
- `balanceGroupsByRating`: seed por rating desc com distribuicao equilibrada.
- `splitOpenLevels`: separa SPING_OPEN em niveis A/B/C/D por classificacao.
- `createBracketWithByes`: gera bracket com preenchimento BYE quando necessario.

## Telas incluidas

- Login Admin
- Dashboard
- Atletas
- Competicoes
- Criar Competicao (Wizard)
- Grupos da Competicao
- Mata-mata da Competicao
- SPING_OPEN niveis A/B/C/D
- Jogos (placar rapido por sets)
- Historico / Auditoria
- Configuracoes

