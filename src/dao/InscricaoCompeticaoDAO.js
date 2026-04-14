const pool = require('../config/database');
const InscricaoCompeticao = require('../models/InscricaoCompeticao');

class InscricaoCompeticaoDAO {
    async findAll() {
        const [rows] = await pool.query(
            `SELECT i.*, c.nome AS competicao_nome, a.nome AS atleta_nome
             FROM inscricoes_competicao i
             INNER JOIN competicoes c ON c.id = i.competicao_id
             INNER JOIN atletas a ON a.id = i.atleta_id
             ORDER BY i.created_at DESC`
        );
        return rows.map((row) => new InscricaoCompeticao(row));
    }

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT i.*, c.nome AS competicao_nome, a.nome AS atleta_nome
             FROM inscricoes_competicao i
             INNER JOIN competicoes c ON c.id = i.competicao_id
             INNER JOIN atletas a ON a.id = i.atleta_id
             WHERE i.id = ?`,
            [id]
        );
        return rows.length ? new InscricaoCompeticao(rows[0]) : null;
    }

    async findByCompeticaoAndAtleta(competicaoId, atletaId) {
        const [rows] = await pool.query(
            'SELECT * FROM inscricoes_competicao WHERE competicao_id = ? AND atleta_id = ? LIMIT 1',
            [competicaoId, atletaId]
        );
        return rows.length ? new InscricaoCompeticao(rows[0]) : null;
    }

    async findByCompeticaoId(competicaoId) {
        const [rows] = await pool.query(
            `SELECT i.*, a.nome AS atleta_nome, a.rating_atual, a.ranking_posicao
             FROM inscricoes_competicao i
             INNER JOIN atletas a ON a.id = i.atleta_id
             WHERE i.competicao_id = ? AND i.status <> 'CANCELADO'
             ORDER BY COALESCE(i.seed_num, 999999), a.rating_atual DESC, a.nome ASC`,
            [competicaoId]
        );
        return rows;
    }

    async createIfNotExists(data) {
        const existing = await this.findByCompeticaoAndAtleta(data.competicao_id, data.atleta_id);
        if (existing) {
            return existing;
        }
        return this.create(data);
    }

    async create(data) {
        const { competicao_id, atleta_id, seed_num = null, status = 'INSCRITO' } = data;
        const [result] = await pool.query(
            `INSERT INTO inscricoes_competicao (competicao_id, atleta_id, seed_num, status)
             VALUES (?, ?, ?, ?)`,
            [competicao_id, atleta_id, seed_num, status]
        );
        return this.findById(result.insertId);
    }

    async update(id, data) {
        const fields = [];
        const values = [];
        const allowed = ['seed_num', 'status'];

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
        await pool.query(`UPDATE inscricoes_competicao SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM inscricoes_competicao WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new InscricaoCompeticaoDAO();

