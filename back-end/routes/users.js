const express = require('express')
const client = require('../db/mongoUtil')
const postsDB = require("../db/postsDB")(client);
const userDB = require("../db/userDB")(client);
const router = express.Router()

router.post('/', async function (req, res) {
    // Get specific blog post by it's title (unique)
    let error = await userDB.isValidUser(req.body.username);
    if (error === null) {
        let response = await userDB.register(req.body);
        if (response === 0)
            res.status(400).json({message: 'Failed to register user'});
        else if (response === 1) {
            let user = await userDB.getUser(req.body.username, req.body.password);
            console.log(user);
            res.status(200).json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                intro: user.intro
            });
        }
    } else
        res.status(400).json({message: error});
})

router.get('/:userId/posts', async function (req, res) {
    // Get specific blog post by it's title (unique)
    const userId = req.params.userId;

    if (userId === undefined || userId === 'undefined' || userId === null ) {
        res.send('userId must be included');
    } else {
        try {
            console.log(`Fetching posts by userId: ${userId}`);
            let results = await postsDB.getsPostsByUserId(userId)
            res.send(results);
        } catch (error) {
            console.log(error);
        }
    }
})

module.exports = router;