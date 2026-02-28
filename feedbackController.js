const feedbackModel = require('../models/feedbackModel');

const feedbackController = {
  // Submit feedback (student)
  async submitFeedback(req, res) {
    try {
      const { projectId, feedbackText } = req.body;
      const studentId = req.user.userId; // from JWT

      if (!projectId || !feedbackText) {
        return res.status(400).json({ message: 'Project ID and feedback text are required' });
      }

      const newFeedback = await feedbackModel.submitFeedback(projectId, studentId, feedbackText);
      res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get feedback for a project (coordinator/admin)
  async getFeedbackByProject(req, res) {
    try {
      const { projectId } = req.params;

      const feedbacks = await feedbackModel.getFeedbackByProject(projectId);
      if (feedbacks.length === 0) {
        return res.status(404).json({ message: 'No feedback found for this project' });
      }

      res.json(feedbacks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = feedbackController;