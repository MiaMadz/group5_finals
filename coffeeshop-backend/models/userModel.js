const db = require('../config/db');

class UserModel {
    static async findUserByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users_tbl WHERE email = ?', [email]);
        return rows[0];
    }

    static async createUser(user) {
        const { name, email, password, address, city, state_province, postal_code, country } = user;
        const [result] = await db.query(
            `INSERT INTO users_tbl (name, email, password, address, city, state_province, postal_code, country)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, password, address, city, state_province, postal_code, country]
        );
        return result;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM users_tbl WHERE id = ?', [id]);
        return rows[0];
    }

    static async updateUser(id, user) {
        const { name, email, password, address, city, state_province, postal_code, country } = user;
        const [result] = await db.query(
            `UPDATE users_tbl
             SET name = ?, email = ?, password = ?, address = ?, city = ?, state_province = ?, postal_code = ?, country = ?
             WHERE id = ?`,
            [name, email, password, address, city, state_province, postal_code, country, id]
        );
        return result.affectedRows;
    }

    static async deleteUser(id) {
        const [results] = await db.query('DELETE FROM users_tbl WHERE id = ?', [id]);
        return results.affectedRows;
    }
}

module.exports = UserModel;