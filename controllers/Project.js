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