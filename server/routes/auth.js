const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, admin } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.get('/users', auth, admin, authController.getAllUsers);
router.delete('/users/:id', auth, admin, authController.deleteUser);

module.exports = router;
