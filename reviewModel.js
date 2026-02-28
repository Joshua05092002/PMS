const pool = require('../db');

const reviewModel = {
  async addReview(projectId, reviewerId, comments) {
    const result = await pool.query(
      'INSERT INTO reviews (project_id, reviewer_id, comments) VALUES ($1, $2, $3) RETURNING *',
      [projectId, reviewerId, comments]
    );
    return result.rows[0];
  },

  async getReviewsByProject(projectId) {
    const result = await pool.query(
      `SELECT r.review_id, r.comments, r.review_date, 
              u.username AS reviewer_name
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.user_id
       WHERE r.project_id = $1
       ORDER BY r.review_date DESC`,
      [projectId]
    );
    return result.rows;
  }
};

module.exports = reviewModel;