const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: 'Name is required'
        }, 
        description: {
            type: String,
            require: 'Email is required',
        },
        fileLink: { 
            type: String, 
            required: 'fileLink is required'
        },
        s3_key:{
            type: String
        } 
    }, 
    {
        timestamps: true
    }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;