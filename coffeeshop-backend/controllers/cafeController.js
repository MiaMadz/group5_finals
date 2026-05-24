const CafeModel = require('../models/cafeModel');
const axios = require('axios');

class CafeController {
    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const city = req.query.city || '';
            const type = req.query.type || '';
            const isUserShop = req.query.is_user_shop !== undefined
                ? req.query.is_user_shop === '1' || req.query.is_user_shop === 'true'
                : null;

            if (req.query.is_user_shop !== undefined && !req.query.limit) {
                limit = 100;
            }

            const cafes = await CafeModel.getAllModel(page, limit, city, type, isUserShop);
            res.json(cafes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const cafe = await CafeModel.getById(req.params.id);
            if (!cafe) return res.status(404).json({ error: 'Cafe not found' });
            res.json(cafe);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addCafe(req, res) {
        try {
            const result = await CafeModel.addCafe(req.body);
            res.json({ message: 'Cafe added successfully', id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateCafe(req, res) {
        try {
            const affected = await CafeModel.updateCafe({ id: req.params.id, ...req.body });
            if (!affected) return res.status(404).json({ error: 'Cafe not found' });
            res.json({ message: 'Cafe updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteCafe(req, res) {
        try {
            const affected = await CafeModel.deleteCafe(req.params.id);
            if (!affected) return res.status(404).json({ error: 'Cafe not found' });
            res.json({ message: 'Cafe deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async importFromApi(req, res) {
        try {
            let page = 1;
            let total = 0;

            while (true) {
                const response = await axios.get(
                    `https://api.openbrewerydb.org/v1/breweries?page=${page}&per_page=50`
                );
                const breweries = response.data;
                if (!breweries.length) break;

                for (const b of breweries) {
                    const address = [b.address_1, b.address_2, b.address_3]
                        .filter(Boolean)
                        .join(', ');

                    await CafeModel.importFromApi({
                        brewery_api_id: b.id,
                        name: b.name,
                        brewery_type: b.brewery_type,
                        address,
                        city: b.city,
                        state_province: b.state_province,
                        postal_code: b.postal_code,
                        country: b.country,
                        longitude: b.longitude,
                        latitude: b.latitude,
                        phone: b.phone,
                        website_url: b.website_url
                    });
                }

                total += breweries.length;
                page++;
            }

            res.json({ message: `Import done! Total: ${total} breweries imported.` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = CafeController;