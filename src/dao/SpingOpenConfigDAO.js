const db = require('../config/database');

class SpingOpenConfigDAO {
    async _normalizeActiveConfigs(preferredId = null) {
        const [activeRows] = await db.query(
            `SELECT id
             FROM sping_open_config
             WHERE ativo = 1
             ORDER BY
                CASE WHEN id = ? THEN 0 ELSE 1 END,
                updated_at DESC,
                created_at DESC,
                id DESC`,
            [preferredId || 0]
        );

        if (activeRows.length <= 1) {
            return;
        }

        const keepId = preferredId || activeRows[0].id;
        await db.query('UPDATE sping_open_config SET ativo = 0 WHERE ativo = 1 AND id <> ?', [keepId]);
    }

    async findAll() {
        await this._normalizeActiveConfigs();
        const [rows] = await db.query('SELECT * FROM sping_open_config ORDER BY created_at DESC');
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM sping_open_config WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async findDefault() {
        const [rows] = await db.query('SELECT * FROM sping_open_config WHERE padrao = 1 LIMIT 1');
        return rows[0] || null;
    }

    async findActive() {
        const [rows] = await db.query('SELECT * FROM sping_open_config WHERE ativo = 1 ORDER BY padrao DESC LIMIT 1');
        return rows[0] || null;
    }

    async create(data) {
        const {
            nome,
            descricao,
            atletas_por_grupo,
            posicoes_nivel_a,
            posicoes_nivel_b,
            posicoes_nivel_c,
            posicoes_nivel_d,
            ativo,
            padrao
        } = data;

        // Se for marcar como padrão, desativa outros
        if (padrao) {
            await db.query('UPDATE sping_open_config SET padrao = 0');
        }

        const [result] = await db.query(
            `INSERT INTO sping_open_config 
            (nome, descricao, atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d, ativo, padrao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome,
                descricao,
                atletas_por_grupo || 5,
                posicoes_nivel_a || '1,2',
                posicoes_nivel_b || '3',
                posicoes_nivel_c || '4',
                posicoes_nivel_d || '5',
                ativo !== false ? 1 : 0,
                padrao ? 1 : 0
            ]
        );

        if (ativo !== false) {
            await this._normalizeActiveConfigs(result.insertId);
        }

        return this.findById(result.insertId);
    }

    async update(id, data) {
        const {
            nome,
            descricao,
            atletas_por_grupo,
            posicoes_nivel_a,
            posicoes_nivel_b,
            posicoes_nivel_c,
            posicoes_nivel_d,
            ativo,
            padrao
        } = data;

        // Se for marcar como padrão, desativa outros
        if (padrao) {
            await db.query('UPDATE sping_open_config SET padrao = 0');
        }

        const updates = [];
        const values = [];

        if (nome !== undefined) {
            updates.push('nome = ?');
            values.push(nome);
        }
        if (descricao !== undefined) {
            updates.push('descricao = ?');
            values.push(descricao);
        }
        if (atletas_por_grupo !== undefined) {
            updates.push('atletas_por_grupo = ?');
            values.push(atletas_por_grupo);
        }
        if (posicoes_nivel_a !== undefined) {
            updates.push('posicoes_nivel_a = ?');
            values.push(posicoes_nivel_a);
        }
        if (posicoes_nivel_b !== undefined) {
            updates.push('posicoes_nivel_b = ?');
            values.push(posicoes_nivel_b);
        }
        if (posicoes_nivel_c !== undefined) {
            updates.push('posicoes_nivel_c = ?');
            values.push(posicoes_nivel_c);
        }
        if (posicoes_nivel_d !== undefined) {
            updates.push('posicoes_nivel_d = ?');
            values.push(posicoes_nivel_d);
        }
        if (ativo !== undefined) {
            updates.push('ativo = ?');
            values.push(ativo ? 1 : 0);
        }
        if (padrao !== undefined) {
            updates.push('padrao = ?');
            values.push(padrao ? 1 : 0);
        }

        if (!updates.length) {
            return this.findById(id);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const query = `UPDATE sping_open_config SET ${updates.join(', ')} WHERE id = ?`;
        await db.query(query, values);

        if (ativo !== undefined && Boolean(ativo)) {
            await this._normalizeActiveConfigs(id);
        }

        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.query('DELETE FROM sping_open_config WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    parsePositions(positionString) {
        if (!positionString || typeof positionString !== 'string') {
            return [];
        }

        return positionString
            .split(',')
            .map((p) => Number(p.trim()))
            .filter((p) => Number.isFinite(p) && p > 0)
            .sort((a, b) => a - b);
    }
}

module.exports = new SpingOpenConfigDAO();

