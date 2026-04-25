-- =========================================================
-- Tabela de Configuração do SPING_OPEN
-- Controla atletas por grupo e categorias (A, B, C, D)
-- =========================================================

CREATE TABLE IF NOT EXISTS sping_open_config  (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    -- Identificação
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NULL,

    -- Configurações de grupos
    atletas_por_grupo INT UNSIGNED NOT NULL DEFAULT 5,

    -- Mapeamento de posição no grupo para categoria
    posicoes_nivel_a VARCHAR(50) NOT NULL DEFAULT '1,2',      -- ex: 1º e 2º lugares
    posicoes_nivel_b VARCHAR(50) NOT NULL DEFAULT '3',        -- ex: 3º lugar
    posicoes_nivel_c VARCHAR(50) NOT NULL DEFAULT '4',        -- ex: 4º lugar
    posicoes_nivel_d VARCHAR(50) NOT NULL DEFAULT '5',        -- ex: 5º lugar

    -- Flags
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    padrao TINYINT(1) NOT NULL DEFAULT 0,  -- uma config padrão apenas

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_sping_config_padrao (padrao),
    KEY idx_sping_config_ativo (ativo)
) ENGINE=InnoDB;

-- Inserir config padrão
INSERT INTO sping_open_config
(nome, descricao, atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d, ativo, padrao)
VALUES
(
    'Configuração Padrão',
    'Grupos de 5 atletas com distribuição A(1-2), B(3), C(4), D(5)',
    5,
    '1,2',
    '3',
    '4',
    '5',
    1,
    1
);

