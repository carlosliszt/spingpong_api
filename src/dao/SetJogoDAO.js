const pool = require('../config/database');
const SetJogo = require('../models/SetJogo');

class SetJogoDAO {
    async findAllByJogoId(jogoId) {
        const [rows] = await pool.query('SELECT * FROM sets_jogo WHERE jogo_id = ? ORDER BY numero_set', [jogoId]);
        return rows.map((row) => new SetJogo(row));
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM sets_jogo WHERE id = ?', [id]);
        return rows.length ? new SetJogo(rows[0]) : null;
    }

    async findByJogoAndNumeroSet(jogoId, numeroSet) {
        const [rows] = await pool.query(
            'SELECT * FROM sets_jogo WHERE jogo_id = ? AND numero_set = ? LIMIT 1',
            [jogoId, numeroSet]
        );
        return rows.length ? new SetJogo(rows[0]) : null;
    }

    async create(data) {
        const { jogo_id, numero_set, pontos_atleta_a, pontos_atleta_b, vencedor_set_id = null } = data;
        const [result] = await pool.query(
            `INSERT INTO sets_jogo (jogo_id, numero_set, pontos_atleta_a, pontos_atleta_b, vencedor_set_id)
             VALUES (?, ?, ?, ?, ?)`,
            [jogo_id, numero_set, pontos_atleta_a, pontos_atleta_b, vencedor_set_id]
        );
        return this.findById(result.insertId);
    }

    async replaceSetsForJogo(jogoId, sets) {
        await pool.query('DELETE FROM sets_jogo WHERE jogo_id = ?', [jogoId]);

        for (const set of sets) {
            await pool.query(
                `INSERT INTO sets_jogo (jogo_id, numero_set, pontos_atleta_a, pontos_atleta_b, vencedor_set_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    jogoId,
                    set.numero_set,
                    set.pontos_atleta_a,
                    set.pontos_atleta_b,
                    set.vencedor_set_id ?? null
                ]
            );
        }

        return this.findAllByJogoId(jogoId);
    }

    async update(id, data) {
        const fields = [];
        const values = [];
        const allowed = ['numero_set', 'pontos_atleta_a', 'pontos_atleta_b', 'vencedor_set_id'];

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
        await pool.query(`UPDATE sets_jogo SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM sets_jogo WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new SetJogoDAO();

