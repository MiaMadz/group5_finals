const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;