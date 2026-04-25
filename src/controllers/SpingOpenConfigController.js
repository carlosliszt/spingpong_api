const SpingOpenConfigService = require('../services/SpingOpenConfigService');

class SpingOpenConfigController {
    async getAll(req, res) {
        try {
            const configs = await SpingOpenConfigService.getAll();
            return res.status(200).json(configs);
        } catch (err) {
            return res.status(err.statusCode || 500).json({ erro: err.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const config = await SpingOpenConfigService.getById(Number(id));
            return res.status(200).json(config);
        } catch (err) {
            return res.status(err.statusCode || 500).json({ erro: err.message });
        }
    }

    async getDefault(req, res) {
        try {
            const config = await SpingOpenConfigService.getDefault();
            return res.status(200).json(config);
        } catch (err) {
            return res.status(err.statusCode || 500).json({ erro: err.message });
        }
    }

    async getActive(req, res) {
        try {
            const config = await SpingOpenConfigService.getActive();
            return res.status(200).json(config);
        } catch (err) {
            return res.status(err.statusCode || 500).json({ erro: err.message });
        }
    }

    async create(req, res) {
        try {
            const config = await SpingOpenConfigService.create(req.body);
            return res.status(201).json(config);
        } catch (err) {
            return res.status(err.statusCode || 500).json({ erro: err.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const config = await SpingOpenConfigService.update(Number(id), req.body);
            return res.status(200).json(config);
        } catch (err) {
            return res.status(err.statusCode || 500).json({ erro: err.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await SpingOpenConfigService.delete(Number(id));
            return res.status(204).send();
        } catch (err) {
            return res.status(err.statusCode || 500).json({ erro: err.message });
        }
    }
}

module.exports = new SpingOpenConfigController();

