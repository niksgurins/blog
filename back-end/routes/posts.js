const express = require('express')
const client = require('../db/mongoUtil')
const postsDB = require("../db/postsDB")(client);
const router = express.Router()

router.get('/', async function (req, res) {
    // Get all(?) blog posts
    const results = await postsDB.getAllPosts();
    res.send(results);
})

router.post('/', async function (req, res) {
    // Add a blog post to the DB
    let latestPostId = await postsDB.getLatestPostId();
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

router.get('/:postId', async function (req, res) {
    // Get specific blog post by it's title (unique)
    const postId = req.params.postId;

    if (isNaN(postId)) {
        res.send('postId must be a positive integer');
    } else {
        try {
            console.log(`Fetching post by postId: ${postId}`);
            let results = await postsDB.getPostById(postId);
            res.send(results);
        } catch (error) {
            console.log(error);
        }
    }
})

module.exports = router;