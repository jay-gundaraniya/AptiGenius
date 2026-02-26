const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { auth, admin } = require('../middleware/auth');

router.get('/random', auth, questionController.getQuestions);
router.get('/all', auth, admin, questionController.getAllQuestions);
router.post('/', auth, admin, questionController.createQuestion);
router.put('/:id', auth, admin, questionController.updateQuestion);
router.delete('/:id', auth, admin, questionController.deleteQuestion);

module.exports = router;
