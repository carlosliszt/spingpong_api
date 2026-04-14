const pool = require('../config/database');

class HistoricoDAO {
    async findResultados(jogoId = null) {
        const params = [];
        let whereClause = '';

        if (jogoId) {
            whereClause = 'WHERE hr.jogo_id = ?';
            params.push(jogoId);
        }

        const [rows] = await pool.query(
            `SELECT hr.*, j.competicao_id
             FROM historico_resultados hr
             INNER JOIN jogos j ON j.id = hr.jogo_id
             ${whereClause}
             ORDER BY hr.created_at DESC`,
            params
        );

        return rows;
    }

    async findResultadoById(id) {
        const [rows] = await pool.query(
            `SELECT hr.*, j.competicao_id
             FROM historico_resultados hr
             INNER JOIN jogos j ON j.id = hr.jogo_id
             WHERE hr.id = ?`,
            [id]
        );
        return rows.length ? rows[0] : null;
    }

    async createResultado(data) {
        const {
            jogo_id,
            status_anterior = null,
            status_novo,
            vencedor_anterior_id = null,
            vencedor_novo_id = null,
            alterado_por,
            motivo = null
        } = data;

        const [result] = await pool.query(
            `INSERT INTO historico_resultados
            (jogo_id, status_anterior, status_novo, vencedor_anterior_id, vencedor_novo_id, alterado_por, motivo)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [jogo_id, status_anterior, status_novo, vencedor_anterior_id, vencedor_novo_id, alterado_por, motivo]
        );

        return this.findResultadoById(result.insertId);
    }

    async updateResultado(id, data) {
        const fields = [];
        const values = [];
        const allowed = [
            'jogo_id',
            'status_anterior',
            'status_novo',
            'vencedor_anterior_id',
            'vencedor_novo_id',
            'alterado_por',
            'motivo'
        ];

        allowed.forEach((field) => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (!fields.length) return this.findResultadoById(id);

        values.push(id);
        await pool.query(`UPDATE historico_resultados SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findResultadoById(id);
    }

    async deleteResultado(id) {
        const [result] = await pool.query('DELETE FROM historico_resultados WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findRating(atletaId = null) {
        const params = [];
        let whereClause = '';

        if (atletaId) {
            whereClause = 'WHERE hrr.atleta_id = ?';
            params.push(atletaId);
        }

        const [rows] = await pool.query(
            `SELECT hrr.*, a.nome AS atleta_nome
             FROM historico_rating_ranking hrr
             INNER JOIN atletas a ON a.id = hrr.atleta_id
             ${whereClause}
             ORDER BY hrr.created_at DESC`,
            params
        );

        return rows;
    }

    async findRatingById(id) {
        const [rows] = await pool.query(
            `SELECT hrr.*, a.nome AS atleta_nome
             FROM historico_rating_ranking hrr
             INNER JOIN atletas a ON a.id = hrr.atleta_id
             WHERE hrr.id = ?`,
            [id]
        );
        return rows.length ? rows[0] : null;
    }

    async createRating(data) {
        const {
            atleta_id,
            jogo_id = null,
            rating_anterior,
            rating_novo,
            ranking_anterior = null,
            ranking_novo = null,
            motivo = null,
            alterado_por = null
        } = data;

        const [result] = await pool.query(
            `INSERT INTO historico_rating_ranking
            (atleta_id, jogo_id, rating_anterior, rating_novo, ranking_anterior, ranking_novo, motivo, alterado_por)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                atleta_id,
                jogo_id,
                rating_anterior,
                rating_novo,
                ranking_anterior,
                ranking_novo,
                motivo,
                alterado_por
            ]
        );

        return this.findRatingById(result.insertId);
    }

    async updateRating(id, data) {
        const fields = [];
        const values = [];
        const allowed = [
            'atleta_id',
            'jogo_id',
            'rating_anterior',
            'rating_novo',
            'ranking_anterior',
            'ranking_novo',
            'motivo',
            'alterado_por'
        ];

        allowed.forEach((field) => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (!fields.length) return this.findRatingById(id);

        values.push(id);
        await pool.query(`UPDATE historico_rating_ranking SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findRatingById(id);
    }

    async deleteRating(id) {
        const [result] = await pool.query('DELETE FROM historico_rating_ranking WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new HistoricoDAO();

