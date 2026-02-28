const pool = require('../db');

const feedbackModel = {
  async submitFeedback(projectId, studentId, feedbackText) {
    const result = await pool.query(
      'INSERT INTO feedback (project_id, student_id, feedback_text) VALUES ($1, $2, $3) RETURNING *',
      [projectId, studentId, feedbackText]
    );
    return result.rows[0];
  },

  async getFeedbackByProject(projectId) {
    const result = await pool.query(
      `SELECT f.feedback_id, f.feedback_text, f.submitted_at, 
              u.username AS student_name
       FROM feedback f
       JOIN users u ON f.student_id = u.user_id
       WHERE f.project_id = $1
       ORDER BY f.submitted_at DESC`,
      [projectId]
    );
    return result.rows;
  }
};

module.exports = feedbackModel;