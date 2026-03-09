const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, admin } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);
router.get('/users', auth, admin, authController.getAllUsers);
router.get('/users/:id', auth, admin, authController.getStudentById);
router.delete('/users/:id', auth, admin, authController.deleteUser);

module.exports = router;
