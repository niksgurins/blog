const client = require('../db/mongoUtil')

module.exports.saveAuthorizationCode = async (code, client, user) => {
    console.log("saveAuthCode");
    const newAuthorizationCode = {
        authorization_code: code.authorizationCode,
        expires_at: code.expiresAt,
        redirect_uri: code.redirectUri,
        client_id: client.id,
        user_id: user._id
    };

    return new Promise(resolve => resolve(insertAuthCode(newAuthorizationCode)));
};

insertAuthCode = async (authCode) => {
    return client.db('blogDB').collection('oauth_authCodes').insertOne({...authCode})
        .then(() => {
            return {
                redirectUri: authCode.redirect_uri,
                authorizationCode: authCode.authorization_code,
                expiresAt: authCode.expires_at,
                client: {id: authCode.client_id},
                user: {id: authCode.user_id}
            };
        })
        .catch(err => console.log(err));
}

module.exports.revokeAuthorizationCode = async (code) => {
    console.log("revokeAuthorizationCode");
    let revoked = false;
    await client.db('blogDB').collection('oauth_authCodes').deleteOne({ authorization_code: code.authorizationCode })
        .then(data => data.deletedCount !== 0 ? revoked = true : null)
        .catch(err => console.log(err))

    return new Promise(resolve => {
        resolve(revoked);
    })   
};

module.exports.getAuthorizationCode = async (authorizationCode) => {
    console.log("getAuthorizationCode");

    let code;
    await client.db('blogDB').collection('oauth_authCodes').findOne({ authorization_code: authorizationCode })
        .then(res => code = res)
        .catch(err => console.log(err))

    const response = { 
        redirectUri: code.redirect_uri,
        authorizationCode: code.authorization_code,
        expiresAt: code.expires_at,
        client: {id: code.client_id},
        user: {id: code.user_id}
    }

    return new Promise(resolve => {
        resolve(response);
    })    
};

module.exports.getAccessToken = (bearerToken) => {
    console.log("getAccessToken");
    return client.db('blogDB').collection('oauth_tokens').findOne({ accessToken: bearerToken });
};

module.exports.getClient = (clientId, clientSecret) => {
    console.log("getClient");
    return client.db('blogDB').collection('oauth_clients').findOne({ id: clientId}) //, secret: clientSecret });
};

module.exports.getUser = (username, password) => {
    console.log("getUser");
    return client.db('blogDB').collection('users').findOne({ username: username, password: password });
};

module.exports.saveToken = async (token, client, user) => {
    console.log("saveToken");

    const accessToken = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        client: client,
        clientId: client.id,
        user: user,
        userId: user.id,
    };

    return new Promise(resolve => resolve(insertAccessToken(accessToken)));
};

insertAccessToken = async (token) => {
    return client.db('blogDB').collection('oauth_tokens').insertOne({...token})
        .then(() => {
            return token;
        })
        .catch(err => console.log(err));
}
