const pool = require('../db');

const userModel = {
  async createUser(username, password, role) {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, password, role]
    );
    return result.rows[0];
  },

  async findUserByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  },

  async getAllUsers() {
    const result = await pool.query('SELECT user_id, username, role, created_at FROM users');
    return result.rows;
  }
};

module.exports = userModel;