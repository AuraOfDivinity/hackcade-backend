const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('../routes/User');
const projectRouter = require('../routes/Project')
const app = express();
const multer = require('multer');
const memoryStorage = multer.memoryStorage();


//db connect 
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mern_ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, () => {
    console.log("Connected to database.")
});

const PORT = process.env.PORT || 8080;

//use express middlewaree
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(multer({ storage: memoryStorage }).single('file'));

//routes
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);

//For heroku deployment - this block of codes will only run in production env
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../client/build/index.html'));
//     });
// }

//error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

//server 
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}. http://localhost:${PORT}`);
});