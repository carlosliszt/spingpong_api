const pool = require('../config/database');
const Jogo = require('../models/Jogo');

class JogoDAO {
    async findAll() {
        const [rows] = await pool.query(
            `SELECT j.*, c.nome AS competicao_nome, aa.nome AS atleta_a_nome, ab.nome AS atleta_b_nome,
                    av.nome AS vencedor_nome
             FROM jogos j
             INNER JOIN competicoes c ON c.id = j.competicao_id
             INNER JOIN atletas aa ON aa.id = j.atleta_a_id
             INNER JOIN atletas ab ON ab.id = j.atleta_b_id
             LEFT JOIN atletas av ON av.id = j.vencedor_id
             ORDER BY j.created_at DESC`
        );
        return rows.map((row) => new Jogo(row));
    }

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT j.*, c.nome AS competicao_nome, aa.nome AS atleta_a_nome, ab.nome AS atleta_b_nome,
                    av.nome AS vencedor_nome
             FROM jogos j
             INNER JOIN competicoes c ON c.id = j.competicao_id
             INNER JOIN atletas aa ON aa.id = j.atleta_a_id
             INNER JOIN atletas ab ON ab.id = j.atleta_b_id
             LEFT JOIN atletas av ON av.id = j.vencedor_id
             WHERE j.id = ?`,
            [id]
        );
        return rows.length ? new Jogo(rows[0]) : null;
    }

    async findByCompeticao(competicaoId) {
        const [rows] = await pool.query(
            `SELECT j.*, c.nome AS competicao_nome, aa.nome AS atleta_a_nome, ab.nome AS atleta_b_nome,
                    av.nome AS vencedor_nome
             FROM jogos j
             INNER JOIN competicoes c ON c.id = j.competicao_id
             INNER JOIN atletas aa ON aa.id = j.atleta_a_id
             INNER JOIN atletas ab ON ab.id = j.atleta_b_id
             LEFT JOIN atletas av ON av.id = j.vencedor_id
             WHERE j.competicao_id = ?
             ORDER BY j.fase ASC, COALESCE(j.rodada, 0) ASC, j.id ASC`,
            [competicaoId]
        );
        return rows.map((row) => new Jogo(row));
    }

    async findByCompeticaoAndFase(competicaoId, fase) {
        const [rows] = await pool.query(
            `SELECT * FROM jogos
             WHERE competicao_id = ? AND fase = ?
             ORDER BY COALESCE(rodada, 0) ASC, id ASC`,
            [competicaoId, fase]
        );
        return rows;
    }

    async findDistinctGroupFases(competicaoId) {
        const [rows] = await pool.query(
            `SELECT DISTINCT fase
             FROM jogos
             WHERE competicao_id = ? AND fase LIKE 'GRUPO_%'
             ORDER BY fase ASC`,
            [competicaoId]
        );
        return rows.map((row) => row.fase);
    }

    async findEliminatoriasByCompeticao(competicaoId) {
        const [rows] = await pool.query(
            `SELECT j.*, aa.nome AS atleta_a_nome, ab.nome AS atleta_b_nome, av.nome AS vencedor_nome
             FROM jogos j
             INNER JOIN atletas aa ON aa.id = j.atleta_a_id
             INNER JOIN atletas ab ON ab.id = j.atleta_b_id
             LEFT JOIN atletas av ON av.id = j.vencedor_id
             WHERE j.competicao_id = ? AND fase NOT LIKE 'GRUPO_%'
             ORDER BY j.fase ASC, COALESCE(j.rodada, 0) ASC, j.id ASC`,
            [competicaoId]
        );
        return rows;
    }

    async create(data) {
        const {
            competicao_id,
            fase,
            rodada = null,
            atleta_a_id,
            atleta_b_id,
            vencedor_id = null,
            status = 'AGENDADO',
            data_hora_prevista = null,
            data_hora_inicio = null,
            data_hora_fim = null,
            observacoes = null
        } = data;

        const [result] = await pool.query(
            `INSERT INTO jogos (competicao_id, fase, rodada, atleta_a_id, atleta_b_id, vencedor_id, status,
                                data_hora_prevista, data_hora_inicio, data_hora_fim, observacoes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                competicao_id,
                fase,
                rodada,
                atleta_a_id,
                atleta_b_id,
                vencedor_id,
                status,
                data_hora_prevista,
                data_hora_inicio,
                data_hora_fim,
                observacoes
            ]
        );

        return this.findById(result.insertId);
    }

    async createMany(matches) {
        const created = [];
        for (const match of matches) {
            created.push(await this.create(match));
        }
        return created;
    }

    async update(id, data) {
        const fields = [];
        const values = [];
        const allowed = [
            'competicao_id',
            'fase',
            'rodada',
            'atleta_a_id',
            'atleta_b_id',
            'vencedor_id',
            'status',
            'data_hora_prevista',
            'data_hora_inicio',
            'data_hora_fim',
            'observacoes'
        ];

        allowed.forEach((field) => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (!fields.length) {
            return this.findById(id);
        }

        values.push(id);
        await pool.query(`UPDATE jogos SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM jogos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new JogoDAO();

