const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateToken, isAuth } = require('../utils/util')

exports.register = async(req, res, next) => {
    const { name, email, password } = req.body;

    // Creating a new user
    const user =  new User({
        name,
        email,
        password: bcrypt.hashSync(password, 8)
    })

    // Save the new user in the database
    const createdUser = await user.save();

    res.send({
        createdUser,
        token: generateToken(createdUser)
    })
}

exports.signin = async(req, res, next) => {
    const { email }  = req.body;

    const user = await User.findOne({ email })
    if(user){
        // Compare passwords and return token if they match
        if(bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });

            return;
        }
    }

    res.status(401).send({ message: 'Invalid email or password'});
}