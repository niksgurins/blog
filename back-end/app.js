// Express/Node imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { promisify } = require('util');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const port = 9000;

// DB imports
const client = require('./db/mongoUtil');
const userDB = require("./db/userDB")(client);

// OAuth imports
const authenticator = require("./auth/authenticator")(userDB);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const test = async () => {
    console.log('Connecting to MongoDB...');
    client.connect();
    client.db('blogDB').collection('posts').findOne({}, function(err, result) {
        if (err) 
            console.log(err);
        
        console.log('Connection established and query test successful: ');
        console.log(result);
    })
}
test();

// Cookies Middleware
app.use(function (req, res, next) {
    // check if client sent cookie
    const cookies = req.cookies;
    console.log(cookies);
    next();
});

app.use('/oauth', cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}), require('./routes/auth.js'))

app.use('/posts', cors({
    origin: '*',
    optionsSuccessStatus: 200
}), require('./routes/posts.js'))

app.post('/users', async function (req, res) {
    // Register user
    authenticator.registerUser(req, res);
})

app.post('/session', async function (req, res) {
    // Login user
    app.oauth.grant();
    authenticator.login(req, res);
})

async function getLatestAuthorId() {
    let authorId = -1;
    const cursor = client.db('blogDB').collection('users').find({})
        .sort({ 'authorId':-1 }).limit(1);

    await cursor.forEach(item => {
        authorId = item.authorId;
    });

    return authorId;
}

function sendResponse(res, message, error) {
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}

app.get('/users', function (req, res) {
    res.send('Got a PUT request at /user')
})

app.post('/users', function (req, res) {
    res.send('Got a DELETE request at /user')
})

const startServer = async () => {
    await promisify(app.listen).bind(app)(port);
    console.log(`Listening on port ${port}`)
}

startServer();