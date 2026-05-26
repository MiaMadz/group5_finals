const express = require('express');
const router = express.Router();
const CafeController = require('../controllers/cafeController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/permits');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', CafeController.getAll);
router.get('/count', CafeController.getCount);
router.get('/:id', CafeController.getById);
router.post('/', upload.single('businessPermit'), CafeController.addCafe);
router.post('/import', CafeController.importFromApi);
router.put('/:id', CafeController.updateCafe);
router.delete('/:id', CafeController.deleteCafe);

module.exports = router;