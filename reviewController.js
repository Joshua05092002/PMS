const reviewModel = require('../models/reviewModel');

const reviewController = {
  // Add a review (supervisor/coordinator)
  async addReview(req, res) {
    try {
      const { projectId, comments } = req.body;
      const reviewerId = req.user.userId; // from JWT

      if (!projectId || !comments) {
        return res.status(400).json({ message: 'Project ID and comments are required' });
      }

      const newReview = await reviewModel.addReview(projectId, reviewerId, comments);
      res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all reviews for a project
  async getReviewsByProject(req, res) {
    try {
      const { projectId } = req.params;

      const reviews = await reviewModel.getReviewsByProject(projectId);
      if (reviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this project' });
      }

      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = reviewController;