const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Add review (supervisor/coordinator)
router.post('/', authMiddleware.verifyRole(['supervisor','coordinator']), reviewController.addReview);

// Get reviews for a project
router.get('/project/:projectId', reviewController.getReviewsByProject);

module.exports = router;