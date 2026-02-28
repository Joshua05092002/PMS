const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Submit feedback (student)
router.post('/', authMiddleware.verifyRole(['student']), feedbackController.submitFeedback);

// Get feedback for a project (coordinator/admin)
router.get('/project/:projectId', authMiddleware.verifyRole(['coordinator','admin']), feedbackController.getFeedbackByProject);

module.exports = router;