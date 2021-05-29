const express = require('express')
const projectRouter = express.Router();
const projectController = require("../controllers/Project")
const { generateToken, isAuth } = require('../utils/util')

// Create a new Project.
projectRouter.post('/create', isAuth, projectController.createProject);

// Update a project
projectRouter.put('/update', isAuth, projectController.updateProject);

// Delete a project
projectRouter.delete('/delete', isAuth, projectController.deleteProject);

module.exports = projectRouter