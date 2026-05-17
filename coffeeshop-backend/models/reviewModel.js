const db = require('../config/db');

class ReviewModel {
    static async getByCafeId(cafe_id) {
        const [rows] = await db.query(
            `SELECT reviews_tbl.*, users_tbl.name as user_name 
             FROM reviews_tbl 
             JOIN users_tbl ON reviews_tbl.user_id = users_tbl.id
             WHERE reviews_tbl.cafe_id = ?`,
            [cafe_id]
        );
        return rows;
    }

    static async addReview(review) {
        const { user_id, cafe_id, stars, review_text } = review;
        const [result] = await db.query(
            `INSERT INTO reviews_tbl (user_id, cafe_id, stars, review_text)
             VALUES (?, ?, ?, ?)`,
            [user_id, cafe_id, stars, review_text]
        );
        return result;
    }

    static async deleteReview(id) {
        const [result] = await db.query('DELETE FROM reviews_tbl WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = ReviewModel;