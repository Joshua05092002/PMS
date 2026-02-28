const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Get all users (protected, only admin/coordinator)
router.get('/', authMiddleware.verifyRole(['admin','coordinator']), userController.getAllUsers);

module.exports = router;