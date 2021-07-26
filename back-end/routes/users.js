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
    let limit;
    if (req.query.limit === undefined)
        limit = 12;
    else {
        try {
            limit = parseInt(req.query.limit);
        } catch (error) {
            console.log(error);
            limit = 12;
        }
    }

    if (userId === undefined || userId === 'undefined' || userId === null ) {
        res.send('userId must be included');
    } else {
        try {
            console.log(`Fetching posts by userId: ${userId}`);
            let results = await postsDB.getsPostsByUserId(userId, limit);
            res.send(results);
        } catch (error) {
            console.log(error);
        }
    }
})

router.get('/:userId/img', async function (req, res) {
    // Get specific blog post by it's title (unique)
    const userId = req.params.userId;

    if (userId === undefined || userId === 'undefined' || userId === null ) {
        res.send('userId must be included');
    } else {
        try {
            console.log(`Fetching image associated with userId: ${userId}`);
            let results = await userDB.getImageByUserId(userId);

            if (results === null || results === undefined || results == "") 
                res.json({ message: "Image not found" });
            else
                res.status(200).json({ message: results });
        } catch (error) {
            console.log(error);
        }
    }
})

router.put('/:userId', async function (req, res) {
    // Get specific blog post by it's title (unique)
    const userId = req.params.userId;
    console.log(req.body);

    if (userId === undefined || userId === 'undefined' || userId === null ) {
        res.send('userId must be included');
    } else {
        try {
            console.log(`Updating details associated with userId: ${userId}`);
            let results = await userDB.updateUserDetails(userId, req.body);

            if (results === "Failed to update user.") 
                res.json({ message: results });
            else
                res.status(200).json({ message: results });
        } catch (error) {
            console.log(error);
        }
    }
})

router.put('/:userId/img', async function (req, res) {
    // Get specific blog post by it's title (unique)
    const userId = req.params.userId;
    const img = req.body.img;

    if (userId === undefined || userId === 'undefined' || userId === null ) {
        res.send('userId must be included');
    } else {
        try {
            console.log(`Updating image associated with userId: ${userId}`);
            let results = await userDB.updateImageByUserId(userId, img);

            if (results === "Failed to update image.") 
                res.json({ message: results });
            else
                res.status(200).json({ message: results });
        } catch (error) {
            console.log(error);
        }
    }
})

module.exports = router;