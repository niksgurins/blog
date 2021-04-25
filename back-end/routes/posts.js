const express = require('express')
const client = require('../db/mongoUtil')
const router = express.Router()
const { ObjectID } = require('bson');

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

router.get('/', async function (req, res) {
    // Get all(?) blog posts
    const results = await getAllPosts();
    res.send(results);
})

router.post('/', async function (req, res) {
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

router.get('/:postId', async function (req, res) {
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

module.exports = router;