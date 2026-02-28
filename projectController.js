const projectModel = require('../models/projectModel');

const projectController = {
  // Create new project (student)
  async createProject(req, res) {
    try {
      const { title, description } = req.body;
      const studentId = req.user.userId; // from JWT

      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }

      const newProject = await projectModel.createProject(title, description, studentId);
      res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all projects (coordinator/admin)
  async getAllProjects(req, res) {
    try {
      const projects = await projectModel.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get project by ID
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = await projectModel.getProjectById(id);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update project status (supervisor/coordinator)
  async updateProjectStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, supervisorId } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const updatedProject = await projectModel.updateProjectStatus(id, status, supervisorId);

      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found or update failed' });
      }

      res.json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = projectController;