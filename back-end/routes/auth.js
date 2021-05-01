const express = require('express')
const client = require('../db/mongoUtil')
const oauthServer = require('../auth/server.js')
const router = express.Router()
const fetch = require("node-fetch");
const { ObjectID } = require('bson');

router.get('/', (req,res) => {  // This is only hit if the user/password cannot be matched to a document in the DB
    res.status(401).json({'message': 'Incorrect login credentials'});
})

router.post('/authorize', async (req, res, next) => {
    const base64EncodedCredentials = Buffer.from(req.headers.authorization, 'base64').toString().split(':');
    const credentials = {'username': base64EncodedCredentials[0], 'password': base64EncodedCredentials[1]}; 
    const query = {username: credentials.username, password: credentials.password}
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
            let user;
            await client.db('blogDB').collection('users').findOne({_id: ObjectID(codeInDB.user_id)})
                .then(data => user = data)
                .catch(err => user = err)

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
                    userId: user._id,
                    firstName: user.firstName, 
                    lastName: user.lastName,
                    intro: user.intro,
                    expires_in: token.expires_in
                    // refresh_token: token.refresh_token,
                    // scope: token.scope
                }

                let optionsHttpOnly = {
                    maxAge: token.expires_in * 1000,
                    httpOnly: true, 
                    path: '/'
                }

                //Set headers
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Cache-Control', 'no-store');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Access-Control-Allow-Credentials', 'true');

                // Set cookies
                res.cookie('access_token', token.access_token, optionsHttpOnly)
                res.cookie('token_type', token.token_type, optionsHttpOnly)
                
                // Send response
                res.status(200).json(response);

            })
            .catch(err => console.log(err));
        } else {
            res.status(400).json({ message: "Invalid request" });
        }
    }
})

module.exports = router;