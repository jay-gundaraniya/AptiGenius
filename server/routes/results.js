const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { auth, admin } = require('../middleware/auth');

router.post('/submit', auth, resultController.submitResult);
router.get('/my-results', auth, resultController.getUserResults);
router.get('/stats', auth, resultController.getStats);
router.get('/ai-readiness', auth, resultController.getAIReadiness);
router.get('/all', auth, admin, resultController.getAllResults);
router.get('/overview', auth, admin, resultController.getAdminOverview);
router.get('/students-stats', auth, admin, resultController.getAllStudentsStats);

module.exports = router;
