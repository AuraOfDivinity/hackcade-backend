const express = require('express')
const projectRouter = express.Router();
const projectController = require("../controllers/Project")
const { generateToken, isAuth } = require('../utils/util')

// Register a new user.
projectRouter.post('/create', isAuth, projectController.createProject);

module.exports = projectRouter