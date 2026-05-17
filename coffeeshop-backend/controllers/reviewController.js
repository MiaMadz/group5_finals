const ReviewModel = require('../models/reviewModel');

class ReviewController {
    static async getByCafeId(req, res) {
        try {
            const reviews = await ReviewModel.getByCafeId(req.params.cafe_id);
            res.json(reviews);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addReview(req, res) {
        try {
            const result = await ReviewModel.addReview(req.body);
            res.json({ message: 'Review added successfully', id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteReview(req, res) {
        try {
            const affected = await ReviewModel.deleteReview(req.params.id);
            if (!affected) return res.status(404).json({ error: 'Review not found' });
            res.json({ message: 'Review deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ReviewController;