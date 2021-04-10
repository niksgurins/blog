const express = require('express')
const client = require('../db/mongoUtil')
const oauthServer = require('../auth/server.js')
const router = express.Router()
const fetch = require("node-fetch");


router.get('/', (req,res) => {  // This is only hit if the user/password cannot be matched to a document in the DB
    res.send("Incorrect login credentials");
})

router.post('/authorize', async (req, res, next) => {
    const {username, password} = req.body
    const query = {username: username, password: password}
    let result;

    await client.db('blogDB').collection('users').findOne(query)
        .then(data => result = data)
        .catch(err => result = err)

    if(result !== undefined && result !== null) {
        req.body.user = result
        return next()
    }

    const params = [ // Send params back down
        'client_id',
        'redirect_uri',
        'response_type',
        'grant_type',
        //'state'
    ].map(a => `${a}=${req.body[a]}`).join('&')

    return res.redirect(`/oauth?success=false&${params}`)
}, (req, res, next) => { // sends us to our redirect with an authorization code in our url
    return next()
}, oauthServer.authorize({
    authenticateHandler: {
        handle: req => {
            return req.body.user
        }
    }
}))
  
router.post('/token', (req, res, next) => {
    next()
},oauthServer.token({
}))

router.get('/exchange', async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        res.status(400).json({ message: "Invalid request" });
    } else {
        const query = { authorization_code: req.query.code };
        let codeInDB;
        await client.db('blogDB').collection('oauth_authCodes').findOne(query)
            .then(data => codeInDB = data)
            .catch(err => codeInDB = err)
        
        if (codeInDB !== undefined && codeInDB !== null) {
            let clientSecret = null;
            fetch('http://localhost:9000/oauth/token', {
                method: 'POST',
                body: `grant_type=authorization_code&code=${req.query.code}&client_id=${codeInDB.client_id}&client_secret=${clientSecret}&redirect_uri=${codeInDB.redirect_uri}`, // this is how we send that data up
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',  // This is REALLY important
                },
            })
            .then(token => token.json())
            .then(token => {
                let response = {
                    access_token: token.access_token,
                    token_type: token.token_type,
                    expires_in: token.expires_in,
                    // refresh_token: token.refresh_token,
                    // scope: token.scope
                }

                res.set({
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                    'Pragma': 'no-cache'
                })
                res.status(200).json({...response});
            })
            .catch(err => console.log(err));
        } else {
            res.status(400).json({ message: "Invalid request" });
        }
    }
})

module.exports = router;