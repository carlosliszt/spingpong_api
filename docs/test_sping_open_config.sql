-- =========================================================
-- TESTE DO SISTEMA DE CONFIGURAÇÃO SPING_OPEN
-- =========================================================

-- 1. Verificar dados atuais
SELECT id, nome, atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d
FROM sping_open_config;

-- 2. Criar configuração alternativa: grupos de 4
INSERT INTO sping_open_config
(nome, descricao, atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d, ativo, padrao)
VALUES
(
    'Configuração: 4 Atletas por Grupo',
    'Grupos de 4 atletas com distribuição A(1-2), B(3), sem nível C/D',
    4,
    '1,2',
    '3',
    '',
    '',
    1,
    0
);

-- 3. Criar configuração para 6 atletas
INSERT INTO sping_open_config
(nome, descricao, atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d, ativo, padrao)
VALUES
(
    'Configuração: 6 Atletas por Grupo',
    'Grupos de 6 atletas com distribuição A(1), B(2-3), C(4-5), D(6)',
    6,
    '1',
    '2,3',
    '4,5',
    '6',
    1,
    0
);

-- 4. Listar todas novamente
SELECT id, nome, atletas_por_grupo, posicoes_nivel_a, ativo, padrao
FROM sping_open_config
ORDER BY padrao DESC, id DESC;

-- 5. Obter apenas a configuração padrão
SELECT * FROM sping_open_config WHERE padrao = 1;

-- 6. Obter configurações ativas
SELECT * FROM sping_open_config WHERE ativo = 1;

-- =========================================================
-- SIMULAÇÃO: 50 ATLETAS COM DIFERENTES CONFIGS
-- =========================================================

-- Config 1: Padrão (5 atletas/grupo)
-- Resultado: 10 grupos × 5 atletas
-- Distribuição Nível A: 1º e 2º × 10 = 20 atletas → próx potência de 2 = 32 (12 BYEs)

-- Config 2: 4 atletas/grupo
-- Resultado: 13 grupos (12 com 4, 1 com 2)
-- Distribuição Nível A: 1º e 2º × 13 = 26 atletas → próx potência de 2 = 32 (6 BYEs)
-- Distribuição Nível B: 3º × 13 = 13 atletas → próx potência de 2 = 16 (3 BYEs)

-- Config 3: 6 atletas/grupo
-- Resultado: 9 grupos (8 com 6, 1 com 2)
-- Distribuição Nível A: 1º × 9 = 9 atletas → próx potência de 2 = 16 (7 BYEs)
-- Distribuição Nível B: 2º e 3º × 9 = 18 atletas → próx potência de 2 = 32 (14 BYEs)
-- Distribuição Nível C: 4º e 5º × 9 = 18 atletas → próx potência de 2 = 32 (14 BYEs)
-- Distribuição Nível D: 6º × 9 = 9 atletas → próx potência de 2 = 16 (7 BYEs)

