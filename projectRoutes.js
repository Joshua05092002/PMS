const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Create new project (student)
router.post('/', authMiddleware.verifyRole(['student']), projectController.createProject);

// Get all projects (coordinator/admin)
router.get('/', authMiddleware.verifyRole(['coordinator','admin']), projectController.getAllProjects);

// Get project by ID
router.get('/:id', projectController.getProjectById);

// Update project status (supervisor/coordinator)
router.put('/:id', authMiddleware.verifyRole(['supervisor','coordinator']), projectController.updateProjectStatus);

module.exports = router;
