const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { promisify } = require('util');
const crypto = require('crypto');
const port = 9000;

// DB imports
const client = require('./db/mongoUtil');
const userDB = require("./db/userDB")(client);
const tokenDB = require("./db/tokenDB")(client);

// OAuth imports
const oAuthService = require("./auth/tokenService")(userDB, tokenDB);
const oAuth2Server = require("oauth2-server");

const authenticator = require("./auth/authenticator")(userDB);

app.oauth = new oAuth2Server({
    model: oAuthService,
    grants: ["password"],
    debug: true,
});

app.use(cors());
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

    console.log(crypto.createHash("sha256").update("shalle").digest("hex"));
}
test();

app.get('/posts', async function (req, res) {
    // Get all(?) blog posts
    const results = await getAllPosts();
    res.send(results);
})

app.post('/posts', async function (req, res) {
    // Add a blog post to the DB
    let latestPostId = await getLatestPostId();
    let newPostId = ++latestPostId;

    let newPost = { 
        postId: newPostId, 
        title: req.body.title, 
        content: req.body.content, 
        authorId: req.body.authorId,
        createdAt: req.body.createdAt
    };

    console.log(newPost);

    client.db('blogDB').collection('posts').insertOne(newPost)
        .then(data => console.log(`Inserted ${data.insertedCount} row(s) into posts collection`))
        .catch(err => console.log(err));
    
    res.send(newPostId.toString());
})

app.get('/posts/:postId', async function (req, res) {
    // Get specific blog post by it's title (unique)
    const postId = req.params.postId;

    if (isNaN(postId)) {
        res.send('postId must be a positive integer');
    } else {
        try {
            console.log(`Fetching post by postId: ${postId}`);
            let results = await getPostById(postId);
            res.send(results);
        } catch (error) {
            console.log(error);
        }
    }
})

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

async function getAllPosts() {
    const results = client.db('blogDB').collection('posts').find().toArray();
    return results;
}

async function getPostById(postId) {
    const query = { postId: parseInt(postId) };
    let results = '';

    await client.db('blogDB').collection('posts').findOne(query)
        .then(data => results = data)
        .catch(err => err);

    return results;
}

async function getLatestPostId() {
    let postId = -1;
    const cursor = client.db('blogDB').collection('posts').find({})
        .sort({ 'postId':-1 }).limit(1);

    await cursor.forEach(item => {
        postId = item.postId;
    });

    return postId;
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