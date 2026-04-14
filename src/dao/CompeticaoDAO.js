const pool = require('../config/database');
const Competicao = require('../models/Competicao');

class CompeticaoDAO {
    async findAll() {
        const [rows] = await pool.query(
            `SELECT c.*, u.nome AS admin_nome
             FROM competicoes c
             INNER JOIN usuarios u ON u.id = c.created_by
             ORDER BY c.data_inicio DESC, c.id DESC`
        );
        return rows.map((row) => new Competicao(row));
    }

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT c.*, u.nome AS admin_nome
             FROM competicoes c
             INNER JOIN usuarios u ON u.id = c.created_by
             WHERE c.id = ?`,
            [id]
        );
        return rows.length ? new Competicao(rows[0]) : null;
    }

    async findByNomeAndDataInicio(nome, dataInicio) {
        const [rows] = await pool.query(
            'SELECT * FROM competicoes WHERE nome = ? AND data_inicio = ? LIMIT 1',
            [nome, dataInicio]
        );
        return rows.length ? new Competicao(rows[0]) : null;
    }

    async create(data) {
        const {
            nome,
            tipo,
            data_inicio,
            data_fim = null,
            status = 'PLANEJADA',
            local = null,
            created_by
        } = data;

        const [result] = await pool.query(
            `INSERT INTO competicoes (nome, tipo, data_inicio, data_fim, status, local, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nome, tipo, data_inicio, data_fim, status, local, created_by]
        );

        return this.findById(result.insertId);
    }

    async update(id, data) {
        const fields = [];
        const values = [];
        const allowed = ['nome', 'tipo', 'data_inicio', 'data_fim', 'status', 'local'];

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
        await pool.query(`UPDATE competicoes SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM competicoes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new CompeticaoDAO();

