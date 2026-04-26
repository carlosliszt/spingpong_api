CREATE DATABASE spingpong CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spingpong;

-- =========================================================
-- 1) USUÁRIOS (ADMIN)
-- =========================================================
CREATE TABLE usuarios (
                          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                          nome VARCHAR(120) NOT NULL,
                          email VARCHAR(180) NOT NULL,
                          senha_hash VARCHAR(255) NOT NULL,
                          papel VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
                          ativo TINYINT(1) NOT NULL DEFAULT 1,
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          PRIMARY KEY (id),
                          UNIQUE KEY uq_usuarios_email (email),
                          CONSTRAINT chk_usuarios_papel CHECK (papel IN ('ADMIN'))
) ENGINE=InnoDB;

-- =========================================================
-- 2) ATLETAS + RANKING / RATING
-- =========================================================
CREATE TABLE atletas (
                         id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                         nome VARCHAR(120) NOT NULL,
                         data_nascimento DATE NULL,
                         sexo VARCHAR(20) NULL,
                         email VARCHAR(180) NULL,
                         telefone VARCHAR(30) NULL,
                         ativo TINYINT(1) NOT NULL DEFAULT 1,

    -- rating: ex. ELO-like
                         rating_atual DECIMAL(10,2) NOT NULL DEFAULT 250.00,

    -- ranking: posição atual (1,2,3...)
                         ranking_posicao INT UNSIGNED NULL,

    -- estatísticas consolidadas
                         partidas_jogadas INT UNSIGNED NOT NULL DEFAULT 0,
                         vitorias INT UNSIGNED NOT NULL DEFAULT 0,
                         derrotas INT UNSIGNED NOT NULL DEFAULT 0,

                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                         PRIMARY KEY (id),
                         UNIQUE KEY uq_atletas_email (email),
                         KEY idx_atletas_ranking (ranking_posicao),
                         KEY idx_atletas_rating (rating_atual)
) ENGINE=InnoDB;

-- Histórico de evolução de ranking/rating
CREATE TABLE historico_rating_ranking (
                                          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                          atleta_id BIGINT UNSIGNED NOT NULL,
                                          jogo_id BIGINT UNSIGNED NULL, -- pode ser nulo para ajustes manuais
                                          rating_anterior DECIMAL(10,2) NOT NULL,
                                          rating_novo DECIMAL(10,2) NOT NULL,
                                          ranking_anterior INT UNSIGNED NULL,
                                          ranking_novo INT UNSIGNED NULL,
                                          motivo VARCHAR(255) NULL,
                                          alterado_por BIGINT UNSIGNED NULL, -- admin que ajustou/manual
                                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                          PRIMARY KEY (id),
                                          KEY idx_hist_rr_atleta (atleta_id),
                                          KEY idx_hist_rr_jogo (jogo_id),
                                          KEY idx_hist_rr_data (created_at),
                                          CONSTRAINT fk_hist_rr_atleta FOREIGN KEY (atleta_id) REFERENCES atletas(id),
                                          CONSTRAINT fk_hist_rr_admin FOREIGN KEY (alterado_por) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- =========================================================
-- 3) COMPETIÇÕES
-- tipos permitidos: SPING_OPEN, SPING_FOODS
-- =========================================================
CREATE TABLE competicoes (
                             id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                             nome VARCHAR(150) NOT NULL,
                             tipo VARCHAR(30) NOT NULL,
                             data_inicio DATE NOT NULL,
                             data_fim DATE NULL,
                             status VARCHAR(20) NOT NULL DEFAULT 'PLANEJADA',
                             local VARCHAR(180) NULL,
                             created_by BIGINT UNSIGNED NOT NULL,
                             created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                             PRIMARY KEY (id),
                             KEY idx_competicoes_tipo (tipo),
                             KEY idx_competicoes_status (status),

                             CONSTRAINT fk_comp_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id),
                             CONSTRAINT chk_comp_tipo CHECK (tipo IN ('SPING_OPEN', 'SPING_FOODS')),
                             CONSTRAINT chk_comp_status CHECK (status IN ('PLANEJADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA')),
                             CONSTRAINT chk_comp_periodo CHECK (data_fim IS NULL OR data_fim >= data_inicio)
) ENGINE=InnoDB;

-- Atletas inscritos na competição
CREATE TABLE inscricoes_competicao (
                                       id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                       competicao_id BIGINT UNSIGNED NOT NULL,
                                       atleta_id BIGINT UNSIGNED NOT NULL,
                                       seed_num INT UNSIGNED NULL,
                                       status VARCHAR(20) NOT NULL DEFAULT 'INSCRITO',
                                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                       PRIMARY KEY (id),
                                       UNIQUE KEY uq_inscricao_comp_atleta (competicao_id, atleta_id),
                                       KEY idx_inscricao_comp (competicao_id),
                                       KEY idx_inscricao_atleta (atleta_id),

                                       CONSTRAINT fk_insc_comp FOREIGN KEY (competicao_id) REFERENCES competicoes(id) ON DELETE CASCADE,
                                       CONSTRAINT fk_insc_atleta FOREIGN KEY (atleta_id) REFERENCES atletas(id),
                                       CONSTRAINT chk_insc_status CHECK (status IN ('INSCRITO', 'CONFIRMADO', 'CANCELADO'))
) ENGINE=InnoDB;

-- =========================================================
-- 4) JOGOS / PARTIDAS
-- =========================================================
CREATE TABLE jogos (
                       id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                       competicao_id BIGINT UNSIGNED NOT NULL,
                       fase VARCHAR(30) NOT NULL, -- GRUPOS, OITAVAS, QUARTAS, SEMI, FINAL...
                       rodada INT UNSIGNED NULL,

                       atleta_a_id BIGINT UNSIGNED NOT NULL,
                       atleta_b_id BIGINT UNSIGNED NOT NULL,
                       vencedor_id BIGINT UNSIGNED NULL,

                       status VARCHAR(20) NOT NULL DEFAULT 'AGENDADO',

                       data_hora_prevista DATETIME NULL,
                       data_hora_inicio DATETIME NULL,
                       data_hora_fim DATETIME NULL,

                       observacoes TEXT NULL,

                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                       PRIMARY KEY (id),
                       KEY idx_jogos_competicao (competicao_id),
                       KEY idx_jogos_status (status),
                       KEY idx_jogos_atleta_a (atleta_a_id),
                       KEY idx_jogos_atleta_b (atleta_b_id),
                       KEY idx_jogos_vencedor (vencedor_id),

                       CONSTRAINT fk_jogo_comp FOREIGN KEY (competicao_id) REFERENCES competicoes(id) ON DELETE CASCADE,
                       CONSTRAINT fk_jogo_atleta_a FOREIGN KEY (atleta_a_id) REFERENCES atletas(id),
                       CONSTRAINT fk_jogo_atleta_b FOREIGN KEY (atleta_b_id) REFERENCES atletas(id),
                       CONSTRAINT fk_jogo_vencedor FOREIGN KEY (vencedor_id) REFERENCES atletas(id),

                       CONSTRAINT chk_jogo_status CHECK (status IN ('AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'W_O', 'CANCELADO')),
                       CONSTRAINT chk_jogo_atletas_diff CHECK (atleta_a_id <> atleta_b_id),
                       CONSTRAINT chk_jogo_vencedor_valido CHECK (
                           vencedor_id IS NULL OR vencedor_id IN (atleta_a_id, atleta_b_id)
                           ),
                       CONSTRAINT chk_jogo_datas CHECK (
                           (data_hora_inicio IS NULL OR data_hora_fim IS NULL OR data_hora_fim >= data_hora_inicio)
                           )
) ENGINE=InnoDB;

-- Placar detalhado por set (histórico da partida)
CREATE TABLE sets_jogo (
                           id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                           jogo_id BIGINT UNSIGNED NOT NULL,
                           numero_set INT UNSIGNED NOT NULL,
                           pontos_atleta_a INT UNSIGNED NOT NULL,
                           pontos_atleta_b INT UNSIGNED NOT NULL,
                           vencedor_set_id BIGINT UNSIGNED NULL,
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           PRIMARY KEY (id),
                           UNIQUE KEY uq_set_unico (jogo_id, numero_set),
                           KEY idx_sets_jogo (jogo_id),

                           CONSTRAINT fk_set_jogo FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
                           CONSTRAINT fk_set_vencedor FOREIGN KEY (vencedor_set_id) REFERENCES atletas(id),
                           CONSTRAINT chk_set_vencedor_pontos CHECK (
                               vencedor_set_id IS NULL
                                   OR pontos_atleta_a <> pontos_atleta_b
                               )
) ENGINE=InnoDB;

-- Histórico de alterações de status/resultado de jogos (auditoria)
CREATE TABLE historico_resultados (
                                      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                      jogo_id BIGINT UNSIGNED NOT NULL,
                                      status_anterior VARCHAR(20) NULL,
                                      status_novo VARCHAR(20) NOT NULL,
                                      vencedor_anterior_id BIGINT UNSIGNED NULL,
                                      vencedor_novo_id BIGINT UNSIGNED NULL,
                                      alterado_por BIGINT UNSIGNED NOT NULL, -- admin
                                      motivo VARCHAR(255) NULL,
                                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                      PRIMARY KEY (id),
                                      KEY idx_hist_res_jogo (jogo_id),
                                      KEY idx_hist_res_admin (alterado_por),
                                      KEY idx_hist_res_data (created_at),

                                      CONSTRAINT fk_hist_res_jogo FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
                                      CONSTRAINT fk_hist_res_venc_ant FOREIGN KEY (vencedor_anterior_id) REFERENCES atletas(id),
                                      CONSTRAINT fk_hist_res_venc_novo FOREIGN KEY (vencedor_novo_id) REFERENCES atletas(id),
                                      CONSTRAINT fk_hist_res_admin FOREIGN KEY (alterado_por) REFERENCES usuarios(id),

                                      CONSTRAINT chk_hist_status_novo CHECK (status_novo IN ('AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'W_O', 'CANCELADO')),
                                      CONSTRAINT chk_hist_status_anterior CHECK (
                                          status_anterior IS NULL OR status_anterior IN ('AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'W_O', 'CANCELADO')
                                          )
) ENGINE=InnoDB;

-- Após criar jogos, adiciona FK do histórico de rating para jogo
ALTER TABLE historico_rating_ranking
    ADD CONSTRAINT fk_hist_rr_jogo FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE SET NULL;

-- =========================================================
-- 5) VIEW opcional: ranking atual ordenado por posição/rating
-- =========================================================
CREATE OR REPLACE VIEW vw_ranking_atual AS
SELECT
    a.id,
    a.nome,
    a.ranking_posicao,
    a.rating_atual,
    a.partidas_jogadas,
    a.vitorias,
    a.derrotas
FROM atletas a
WHERE a.ativo = 1
ORDER BY
    CASE WHEN a.ranking_posicao IS NULL THEN 1 ELSE 0 END,
    a.ranking_posicao ASC,
    a.rating_atual DESC;


DELIMITER $$

-- =========================================================
-- 1) Função: faixa do rating (A..O)
-- =========================================================
DROP FUNCTION IF EXISTS fn_faixa_rating $$
CREATE FUNCTION fn_faixa_rating(p_rating DECIMAL(10,2))
    RETURNS CHAR(1)
    DETERMINISTIC
BEGIN
  DECLARE v_faixa CHAR(1);

  IF p_rating >= 3300 THEN SET v_faixa = 'A';
  ELSEIF p_rating >= 2800 THEN SET v_faixa = 'B';
  ELSEIF p_rating >= 2300 THEN SET v_faixa = 'C';
  ELSEIF p_rating >= 1900 THEN SET v_faixa = 'D';
  ELSEIF p_rating >= 1600 THEN SET v_faixa = 'E';
  ELSEIF p_rating >= 1300 THEN SET v_faixa = 'F';
  ELSEIF p_rating >= 1000 THEN SET v_faixa = 'G';
  ELSEIF p_rating >= 850 THEN SET v_faixa = 'H';
  ELSEIF p_rating >= 700 THEN SET v_faixa = 'I';
  ELSEIF p_rating >= 550 THEN SET v_faixa = 'J';
  ELSEIF p_rating >= 400 THEN SET v_faixa = 'L';
  ELSEIF p_rating >= 350 THEN SET v_faixa = 'M';
  ELSEIF p_rating >= 251 THEN SET v_faixa = 'N';
ELSE SET v_faixa = 'O';
END IF;

RETURN v_faixa;
END $$

-- =========================================================
-- 2) Procedure: obtém vencedor de um jogo por sets (SEM UPDATE em jogos)
-- =========================================================
DROP PROCEDURE IF EXISTS sp_obter_vencedor_jogo $$
CREATE PROCEDURE sp_obter_vencedor_jogo(
    IN p_jogo_id BIGINT UNSIGNED,
    OUT p_vencedor_id BIGINT UNSIGNED
)
BEGIN
  DECLARE v_atleta_a BIGINT UNSIGNED;
  DECLARE v_atleta_b BIGINT UNSIGNED;
  DECLARE v_sets_a INT DEFAULT 0;
  DECLARE v_sets_b INT DEFAULT 0;

SELECT j.atleta_a_id, j.atleta_b_id
INTO v_atleta_a, v_atleta_b
FROM jogos j
WHERE j.id = p_jogo_id;

SELECT
    COALESCE(SUM(CASE WHEN s.pontos_atleta_a > s.pontos_atleta_b THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN s.pontos_atleta_b > s.pontos_atleta_a THEN 1 ELSE 0 END), 0)
INTO v_sets_a, v_sets_b
FROM sets_jogo s
WHERE s.jogo_id = p_jogo_id;

IF v_sets_a > v_sets_b THEN
    SET p_vencedor_id = v_atleta_a;
  ELSEIF v_sets_b > v_sets_a THEN
    SET p_vencedor_id = v_atleta_b;
ELSE
    SET p_vencedor_id = NULL;
END IF;
END $$

-- =========================================================
-- 3) Procedure: pontos base por Δ e tipo de vitória
-- p_expected_win = 1 -> vitória esperada
-- p_expected_win = 0 -> vitória inesperada
-- =========================================================
DROP PROCEDURE IF EXISTS sp_get_pontos_partida $$
CREATE PROCEDURE sp_get_pontos_partida(
    IN  p_diff INT,
    IN  p_expected_win TINYINT,
    OUT p_v_points INT,
    OUT p_l_points INT
)
BEGIN
  SET p_v_points = 0;
  SET p_l_points = 0;

  IF p_expected_win = 1 THEN
    -- Vitórias esperadas
    IF p_diff >= 750 THEN
      SET p_v_points = 1;  SET p_l_points = 0;
    ELSEIF p_diff >= 500 THEN
      SET p_v_points = 2;  SET p_l_points = 0;
    ELSEIF p_diff >= 400 THEN
      SET p_v_points = 3;  SET p_l_points = 1;
    ELSEIF p_diff >= 300 THEN
      SET p_v_points = 4;  SET p_l_points = 2;
    ELSEIF p_diff >= 200 THEN
      SET p_v_points = 5;  SET p_l_points = 3;
    ELSEIF p_diff >= 150 THEN
      SET p_v_points = 6;  SET p_l_points = 4;
    ELSEIF p_diff >= 100 THEN
      SET p_v_points = 7;  SET p_l_points = 5;
    ELSEIF p_diff >= 50 THEN
      SET p_v_points = 8;  SET p_l_points = 6;
    ELSEIF p_diff >= 25 THEN
      SET p_v_points = 9;  SET p_l_points = 7;
ELSE
      SET p_v_points = 10; SET p_l_points = 8;
END IF;
ELSE
    -- Vitórias/derrotas inesperadas
    IF p_diff >= 500 THEN
      SET p_v_points = 30; SET p_l_points = 22;
    ELSEIF p_diff >= 400 THEN
      SET p_v_points = 26; SET p_l_points = 20;
    ELSEIF p_diff >= 300 THEN
      SET p_v_points = 23; SET p_l_points = 18;
    ELSEIF p_diff >= 200 THEN
      SET p_v_points = 20; SET p_l_points = 16;
    ELSEIF p_diff >= 150 THEN
      SET p_v_points = 18; SET p_l_points = 14;
    ELSEIF p_diff >= 100 THEN
      SET p_v_points = 16; SET p_l_points = 12;
    ELSEIF p_diff >= 50 THEN
      SET p_v_points = 14; SET p_l_points = 11;
    ELSEIF p_diff >= 25 THEN
      SET p_v_points = 12; SET p_l_points = 10;
ELSE
      SET p_v_points = 11; SET p_l_points = 9;
END IF;
END IF;
END $$

-- =========================================================
-- 4) Trigger principal (rating por tabela + peso do evento)
-- =========================================================
DROP TRIGGER IF EXISTS trg_jogos_bu_finalizacao $$
CREATE TRIGGER trg_jogos_bu_finalizacao
    BEFORE UPDATE ON jogos
    FOR EACH ROW
BEGIN
    DECLARE v_tipo VARCHAR(30);
  DECLARE v_peso INT DEFAULT 1;

  DECLARE v_ra_old DECIMAL(10,2);
  DECLARE v_rb_old DECIMAL(10,2);
  DECLARE v_ra_new DECIMAL(10,2);
  DECLARE v_rb_new DECIMAL(10,2);

  DECLARE v_diff INT;
  DECLARE v_expected_win TINYINT;

  DECLARE v_v_points INT;
  DECLARE v_l_points INT;

  DECLARE v_vencedor_calc BIGINT UNSIGNED;
  DECLARE v_admin_id BIGINT UNSIGNED DEFAULT 1;

  IF NEW.status = 'FINALIZADO' AND OLD.status <> 'FINALIZADO' THEN

    -- Se não veio vencedor, tenta obter via sets
    IF NEW.vencedor_id IS NULL THEN
      CALL sp_obter_vencedor_jogo(NEW.id, v_vencedor_calc);
      SET NEW.vencedor_id = v_vencedor_calc;
END IF;

-- valida vencedor
IF NEW.vencedor_id IS NULL OR NEW.vencedor_id NOT IN (NEW.atleta_a_id, NEW.atleta_b_id) THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Jogo FINALIZADO exige vencedor_id válido (atleta_a_id ou atleta_b_id).';
END IF;

    -- peso por tipo de competição
SELECT c.tipo INTO v_tipo
FROM competicoes c
WHERE c.id = NEW.competicao_id;

IF v_tipo = 'SPING_OPEN' THEN
      SET v_peso = 2;
ELSE
      SET v_peso = 1; -- SPING_FOODS
END IF;

    -- ratings atuais
SELECT rating_atual INTO v_ra_old
FROM atletas
WHERE id = NEW.atleta_a_id
    FOR UPDATE;

SELECT rating_atual INTO v_rb_old
FROM atletas
WHERE id = NEW.atleta_b_id
    FOR UPDATE;

SET v_diff = ABS(ROUND(v_ra_old - v_rb_old));

    -- esperado/inseperado
    IF (NEW.vencedor_id = NEW.atleta_a_id AND v_ra_old >= v_rb_old)
       OR (NEW.vencedor_id = NEW.atleta_b_id AND v_rb_old >= v_ra_old) THEN
      SET v_expected_win = 1;
ELSE
      SET v_expected_win = 0;
END IF;

CALL sp_get_pontos_partida(v_diff, v_expected_win, v_v_points, v_l_points);

SET v_v_points = v_v_points * v_peso;
    SET v_l_points = v_l_points * v_peso;

    -- aplica stats + rating
    IF NEW.vencedor_id = NEW.atleta_a_id THEN
      SET v_ra_new = v_ra_old + v_v_points;
      SET v_rb_new = GREATEST(0, v_rb_old - v_l_points);

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    vitorias = vitorias + 1,
    rating_atual = v_ra_new
WHERE id = NEW.atleta_a_id;

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    derrotas = derrotas + 1,
    rating_atual = v_rb_new
WHERE id = NEW.atleta_b_id;
ELSE
      SET v_rb_new = v_rb_old + v_v_points;
      SET v_ra_new = GREATEST(0, v_ra_old - v_l_points);

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    derrotas = derrotas + 1,
    rating_atual = v_ra_new
WHERE id = NEW.atleta_a_id;

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    vitorias = vitorias + 1,
    rating_atual = v_rb_new
WHERE id = NEW.atleta_b_id;
END IF;

    -- histórico de rating (A)
INSERT INTO historico_rating_ranking
(atleta_id, jogo_id, rating_anterior, rating_novo, ranking_anterior, ranking_novo, motivo, alterado_por, created_at)
VALUES
    (NEW.atleta_a_id, NEW.id, v_ra_old, v_ra_new, NULL, NULL,
     CONCAT('Finalização de jogo | tipo=', v_tipo, ' | peso=', v_peso, ' | Δ=', v_diff, ' | esperado=', v_expected_win),
     v_admin_id, NOW());

-- histórico de rating (B)
INSERT INTO historico_rating_ranking
(atleta_id, jogo_id, rating_anterior, rating_novo, ranking_anterior, ranking_novo, motivo, alterado_por, created_at)
VALUES
    (NEW.atleta_b_id, NEW.id, v_rb_old, v_rb_new, NULL, NULL,
     CONCAT('Finalização de jogo | tipo=', v_tipo, ' | peso=', v_peso, ' | Δ=', v_diff, ' | esperado=', v_expected_win),
     v_admin_id, NOW());

-- auditoria de resultado
INSERT INTO historico_resultados
(jogo_id, status_anterior, status_novo, vencedor_anterior_id, vencedor_novo_id, alterado_por, motivo, created_at)
VALUES
    (NEW.id, OLD.status, NEW.status, OLD.vencedor_id, NEW.vencedor_id, v_admin_id, 'Finalização de jogo', NOW());

IF NEW.data_hora_fim IS NULL THEN
      SET NEW.data_hora_fim = NOW();
END IF;

END IF;
END $$

DELIMITER ;

