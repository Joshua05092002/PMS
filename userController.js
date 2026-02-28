const path = require('path');
console.log("Looking for userModel at:", path.resolve(__dirname, '../models/userModel.js'));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = 'supersecretkey';

const userController = {
  // Register new user
  async registerUser(req, res) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user
      const newUser = await userModel.createUser(username, hashedPassword, role);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Login user
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await userModel.findUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all users (admin/coordinator only)
  async getAllUsers(req, res) {
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = userController;