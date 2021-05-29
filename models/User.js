const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: 'Name is required'
        },
        email: {
            type: String,
            require: 'Email is required',
            unique: true
        },
        password: {
            type: String,
            required: 'Password is required'
        },
        projects: [{
            projectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Project',
            },
            name: String,
            description: String,
            fileLink: String
        }]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;