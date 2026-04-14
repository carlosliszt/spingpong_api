const pool = require('../config/database');
const Usuario = require('../models/Usuario');

class UsuarioDAO {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY nome');
        return rows.map((row) => new Usuario(row));
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows.length ? new Usuario(rows[0]) : null;
    }

    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
        return rows.length ? new Usuario(rows[0]) : null;
    }

    async create(data) {
        const { nome, email, senha_hash, papel = 'ADMIN', ativo = 1 } = data;
        const [result] = await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash, papel, ativo) VALUES (?, ?, ?, ?, ?)',
            [nome, email, senha_hash, papel, ativo]
        );
        return this.findById(result.insertId);
    }

    async update(id, data) {
        const fields = [];
        const values = [];
        const allowed = ['nome', 'email', 'senha_hash', 'papel', 'ativo'];

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
        await pool.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new UsuarioDAO();

