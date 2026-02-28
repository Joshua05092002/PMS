const pool = require('../db');

const projectModel = {
  async createProject(title, description, studentId) {
    const result = await pool.query(
      'INSERT INTO projects (title, description, student_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, studentId]
    );
    return result.rows[0];
  },

  async getAllProjects() {
    const result = await pool.query(
      `SELECT p.project_id, p.title, p.description, p.status, 
              u.username AS student_name, p.created_at
       FROM projects p
       JOIN users u ON p.student_id = u.user_id`
    );
    return result.rows;
  },

  async getProjectById(projectId) {
    const result = await pool.query(
      `SELECT p.project_id, p.title, p.description, p.status, 
              u.username AS student_name, p.created_at
       FROM projects p
       JOIN users u ON p.student_id = u.user_id
       WHERE p.project_id = $1`,
      [projectId]
    );
    return result.rows[0];
  },

  async updateProjectStatus(projectId, status, supervisorId) {
    const result = await pool.query(
      `UPDATE projects 
       SET status = $1, supervisor_id = $2
       WHERE project_id = $3
       RETURNING *`,
      [status, supervisorId, projectId]
    );
    return result.rows[0];
  }
};

module.exports = projectModel;