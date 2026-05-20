const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');

router.get('/:cafe_id', ReviewController.getByCafeId);
router.post('/', ReviewController.addReview);
router.delete('/:id', ReviewController.deleteReview);

module.exports = router;