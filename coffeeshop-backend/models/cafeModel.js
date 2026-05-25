const db = require('../config/db');

class CafeModel {
    static async getAllModel(page = 1, limit = 20, city = '', type = '', isUserShop = null) {
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
        if (isUserShop !== null) {
            query += ' AND is_user_shop = ?';
            params.push(isUserShop ? 1 : 0);
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
    const {
        added_by = null,
        brewery_api_id = null,
        name,
        brewery_type = null,
        address = null,
        city = null,
        state_province = null,
        postal_code = null,
        country = null,
        longitude = null,
        latitude = null,
        phone = null,
        website_url = null,
        directions_url = null,
        isUserShop = 0,
        businessPermitName = null,
    } = cafe;

    const [result] = await db.query(
        `INSERT INTO cafes_tbl (
             added_by, brewery_api_id, name, brewery_type, address,
             city, state_province, postal_code, country, longitude,
             latitude, phone, website_url, directions_url,
             is_user_shop, business_permit_name
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            added_by, brewery_api_id, name, brewery_type, address,
            city, state_province, postal_code, country, longitude,
            latitude, phone, website_url, directions_url,
            isUserShop ? 1 : 0, businessPermitName,
        ]
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