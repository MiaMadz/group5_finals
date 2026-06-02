const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');

router.get('/all/recent', ReviewController.getAllRecent);
router.get('/cafe/:cafeId/summary', ReviewController.getSummary);
router.get('/cafe/:cafeId', ReviewController.getByCafeId);
router.post('/', ReviewController.addReview);
router.delete('/:id', ReviewController.deleteReview);

module.exports = router;