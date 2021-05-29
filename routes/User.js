const express = require('express')
const userRouter = express.Router();
const userController = require("../controllers/User")

// Register a new user.
userRouter.post('/register', userController.register);

// Sign In a user.
userRouter.post('/signin', userController.signin)

module.exports = userRouter
