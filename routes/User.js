const express = require('express')
const userRouter = express.Router();
const userController = require("../controllers/User")
const { isAuth } = require('../utils/util')

// Register a new user.
userRouter.post('/register', userController.register);

// Sign In a user.
userRouter.post('/signin', userController.signin)

// Get User Details
userRouter.get('/get-by-id', isAuth, userController.getUserDetails)

module.exports = userRouter
