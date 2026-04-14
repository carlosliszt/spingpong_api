const pool = require('../config/database');
const Atleta = require('../models/Atleta');

class AtletaDAO {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM atletas ORDER BY nome');
        return rows.map((row) => new Atleta(row));
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM atletas WHERE id = ?', [id]);
        return rows.length ? new Atleta(rows[0]) : null;
    }

    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM atletas WHERE email = ? LIMIT 1', [email]);
        return rows.length ? new Atleta(rows[0]) : null;
    }

    async findByNome(nome) {
        const [rows] = await pool.query('SELECT * FROM atletas WHERE nome = ? LIMIT 1', [nome]);
        return rows.length ? new Atleta(rows[0]) : null;
    }

    async findManyByIds(ids) {
        if (!ids.length) return [];
        const placeholders = ids.map(() => '?').join(', ');
        const [rows] = await pool.query(`SELECT * FROM atletas WHERE id IN (${placeholders})`, ids);
        return rows.map((row) => new Atleta(row));
    }

    async create(data) {
        const {
            nome,
            data_nascimento = null,
            sexo = null,
            email = null,
            telefone = null,
            ativo = 1,
            rating_atual = 250.0,
            ranking_posicao = 0
        } = data;

        const [result] = await pool.query(
            `INSERT INTO atletas (nome, data_nascimento, sexo, email, telefone, ativo, rating_atual, ranking_posicao)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, data_nascimento, sexo, email, telefone, ativo, rating_atual, ranking_posicao]
        );

        return this.findById(result.insertId);
    }

    async update(id, data) {
        const fields = [];
        const values = [];
        const allowed = ['nome', 'data_nascimento', 'sexo', 'email', 'telefone', 'ativo', 'rating_atual', 'ranking_posicao'];

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
        await pool.query(`UPDATE atletas SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM atletas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async rankingAtual() {
        const [rows] = await pool.query('SELECT * FROM vw_ranking_atual');
        return rows;
    }

    async addRankingPoints(atletaId, pontos) {
        await pool.query(
            'UPDATE atletas SET ranking_posicao = COALESCE(ranking_posicao, 0) + ? WHERE id = ?',
            [pontos, atletaId]
        );
        return this.findById(atletaId);
    }
}

module.exports = new AtletaDAO();

