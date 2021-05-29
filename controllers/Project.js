const User = require('../models/User')
const Project = require('../models/Project')
var AWS = require('aws-sdk');


exports.createProject = async (req, res, next) => {
    const { name, description, userId } = req.body

    if (!req.file) {
        res.status(401).send({ message: 'File containing the project data is required.' });
    }

    const file = req.file;
    const s3FileURL = process.env.AWS_UPLOADED_FILE_URL_LINK;

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    s3bucket.upload(params, async function (err, data) {
        if (err) {
            res.status(500).json({ error: true, Message: err });
        } else {
            const fileLink = s3FileURL + file.originalname;

            const project = new Project({
                name,
                description,
                fileLink
            })

            const createdProject = await project.save();

            const projectdata = {
                projectId: createdProject._id,
                name: createdProject.name,
                description: createdProject.description,
                fileLink: createdProject.fileLink,
            }

            User.updateOne(
                { _id: userId },
                { $push: { projects: projectdata } }
            ).then(project => {
                res.send({
                    name,
                    description,
                    fileLink,
                    projectId: createdProject.projectId
                });
            });
        }
    });
}

exports.updateProject = async (req, res, next) => {
    const { name, description, projectId } = req.body
    const userId = req.user._id;
    if (!name) {
        res.status(401).send({ message: 'Name field is required' });
        return;
    }

    if (!projectId) {
        res.status(401).send({ message: 'projetId field is required' });
        return;
    }

    if (!description) {
        res.status(401).send({ message: 'Description field is required' });
        return;
    }

    const updatedProject = await Project.findByIdAndUpdate({ _id: projectId }, { name: name, description: description })
    if (updatedProject) {
        res.json({ message: "Project updated successfully", data: updatedProject })
    }
    return res.status(401).send({ message: 'Cannot find project with specified Id' });
}

exports.deleteProject = async (req, res, next) => {
    const { projectId } = req.body

    if (!projectId) {
        return res.status(401).send({ message: 'ProjectId field is required' });
    }

    Project.findByIdAndDelete({ _id: projectId }, function (err, result) {
        if (err) {
            return res.status(500).send({ 'message': err.message })
        }
        res.status(200).send({ message: 'Successfully deleted project', data: result });
    })
}