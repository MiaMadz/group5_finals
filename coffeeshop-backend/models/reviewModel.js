const db = require('../config/db');

class ReviewModel {
    static async getByCafeId(cafe_id) {
        const [rows] = await db.query(
            `SELECT reviews_tbl.*, users_tbl.name as user_name, cafes_tbl.name as cafe_name
             FROM reviews_tbl 
             JOIN users_tbl ON reviews_tbl.user_id = users_tbl.id
             JOIN cafes_tbl ON reviews_tbl.cafe_id = cafes_tbl.id
             WHERE reviews_tbl.cafe_id = ?`,
            [cafe_id]
        );
        return rows;
    }

    static async getSummary(cafe_id) {
        const [rows] = await db.query(
            `SELECT stars FROM reviews_tbl WHERE cafe_id = ?`,
            [cafe_id]
        );
        const total = rows.length;
        const average = total > 0
            ? rows.reduce((sum, r) => sum + r.stars, 0) / total
            : 0;

        const breakdown = [5, 4, 3, 2, 1].map((star) => {
            const count = rows.filter((r) => r.stars === star).length;
            return {
                label: String(star),
                count,
                percentage: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%',
            };
        });

        return { total, average: Math.round(average * 10) / 10, breakdown };
    }

    static async getAllRecent(limit = 12) {
        const [rows] = await db.query(
            `SELECT reviews_tbl.*, users_tbl.name as user_name, cafes_tbl.name as cafe_name
             FROM reviews_tbl 
             JOIN users_tbl ON reviews_tbl.user_id = users_tbl.id
             JOIN cafes_tbl ON reviews_tbl.cafe_id = cafes_tbl.id
             ORDER BY reviews_tbl.created_at DESC
             LIMIT ?`,
            [limit]
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

    static async deleteByUser(userId) {
        const [result] = await db.query('DELETE FROM reviews_tbl WHERE user_id = ?', [userId]);
        return result.affectedRows;
    }
}

module.exports = ReviewModel;