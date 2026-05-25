const express = require('express');
const router = express.Router();
const CafeController = require('../controllers/cafeController');

router.get('/', CafeController.getAll);
router.get('/count', CafeController.getCount);
router.get('/countries', CafeController.getCountries);
router.get('/countries/count', CafeController.getCountryCount);
router.get('/:id', CafeController.getById);
router.post('/', CafeController.addCafe);
router.post('/import', CafeController.importFromApi);
router.put('/:id', CafeController.updateCafe);
router.delete('/:id', CafeController.deleteCafe);

module.exports = router;