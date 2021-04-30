// Express/Node imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { promisify } = require('util');
const crypto = require('crypto');
const cookieParser = require("cookie-parser");

const app = express();
const port = 9000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// DB imports
const client = require('./db/mongoUtil');
const { token } = require('./auth/server');
const userDB = require("./db/userDB")(client);

// OAuth imports
const authenticator = require("./auth/authenticator")(userDB);

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

app.use('/oauth', cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}), require('./routes/auth.js'))

app.use('/posts', cors({
    origin: '*',
    optionsSuccessStatus: 200
}), require('./routes/posts.js'))

app.get('/signedIn', cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}), async (req, res) => {
    if (!req.cookies.access_token) 
        res.status(401).json({signedIn: false});
    else {
        let token = await getTokenObject(req.cookies.access_token);
        if (token === undefined)
            res.status(401).json({signedIn: false});
        else {
            let user = await getUserById(token.userId);
            res.status(200).json({signedIn: true, userId: token.userId, firstName: user.firstName});
        }
    }
})

const getTokenObject = async token => {
    let obj;
    await client.db('blogDB').collection('oauth_tokens').findOne({ accessToken: token })
        .then(res => obj = res)
        .catch(err => { console.log(err); res.status(404).json({ error: 'Token not found' }); });

    return obj;
}

const getUserById = async userId => {
    let user;
    await client.db('blogDB').collection('users').findOne({ _id: userId })
        .then(res => user = res)
        .catch(err => { console.log(err); res.status(404).json({ error: 'User not found' }); });

    return user;
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