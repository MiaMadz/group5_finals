const db = require('../config/db');

class CafeModel {
    static async getAllModel(page = 1, limit = 20, city = '', type = '', country = '') {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM cafes_tbl WHERE 1=1';
        const params = [];

        if (city) {
            query += ' AND city = ?';
            params.push(city);
        }
        if (type) {
            query += ' AND brewery_type = ?';
            params.push(type);
        }
        if (country) {
            query += ' AND country = ?';
            params.push(country);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getCountModel(city = '', type = '', country = '') {
        let query = 'SELECT COUNT(*) AS total FROM cafes_tbl WHERE 1=1';
        const params = [];

        if (city) {
            query += ' AND city = ?';
            params.push(city);
        }
        if (type) {
            query += ' AND brewery_type = ?';
            params.push(type);
        }
        if (country) {
            query += ' AND country = ?';
            params.push(country);
        }

        const [rows] = await db.query(query, params);
        return rows[0]?.total || 0;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM cafes_tbl WHERE id = ?', [id]);
        return rows[0];
    }

    static async addCafe(cafe) {
        const { added_by, name, address, city, state_province, postal_code, country } = cafe;
        const [result] = await db.query(
            `INSERT INTO cafes_tbl (added_by, name, address, city, state_province, postal_code, country)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [added_by, name, address, city, state_province, postal_code, country]
        );
        return result;
    }

    static async importFromApi(cafe) {
        const { brewery_api_id, name, brewery_type, address, city, state_province, postal_code, country, longitude, latitude, phone, website_url } = cafe;
        const [result] = await db.query(
            `INSERT IGNORE INTO cafes_tbl 
             (brewery_api_id, name, brewery_type, address, city, state_province, postal_code, country, longitude, latitude, phone, website_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [brewery_api_id, name, brewery_type, address, city, state_province, postal_code, country, longitude, latitude, phone, website_url]
        );
        return result;
    }

    static async getByName(name) {
        const [results] = await db.query('SELECT * FROM cafes_tbl WHERE name = ?', [name]);
        return results;
    }

    static async updateCafe(cafe) {
        const { id, name, address, city, state_province, postal_code, country } = cafe;
        const [results] = await db.query(
            `UPDATE cafes_tbl 
             SET name = ?, address = ?, city = ?, state_province = ?, postal_code = ?, country = ? 
             WHERE id = ?`,
            [name, address, city, state_province, postal_code, country, id]
        );
        return results.affectedRows;
    }

    static async deleteCafe(id) {
        const [result] = await db.query('DELETE FROM cafes_tbl WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = CafeModel;