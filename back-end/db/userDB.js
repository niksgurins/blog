let client;

module.exports = (injectedMongoClient) => {
    client = injectedMongoClient;

    return {
        register: register,
        getUser: getUser,
        isValidUser: isValidUser,
    };
};

var crypto = require("crypto");

async function register(user) {
    // Register
    let newUser = {
        username: user.username, 
        password: crypto.createHash("sha256").update(user.password).digest("hex"),
        firstName: user.firstName, 
        lastName: user.lastName,
        intro: user.intro
        // createdAt: user.createdAt,
        // status: 'Active'
    };

    let dbResponse;
    await client.db('blogDB').collection('users').insertOne(newUser)
        .then(data => dbResponse = data.insertedCount) // 0 if not inserted, 1 if it did
        .catch(err => dbResponse = err);

    return dbResponse;
}

async function getUser(username, password) {
    const shaPass = crypto.createHash("sha256").update(password).digest("hex");
    const query = { username: username, password: shaPass };

    await client.db('blogDB').collection('users').findOne(query)
        .then(data => data === null ? err = 'Incorrect login details' : err = null)
        .catch(err => res.send(err));
}

async function isValidUser (username) {
    const query = { username: username };
    let error = '';

    await client.db('blogDB').collection('users').findOne(query)
        .then(data => data !== null ? error = 'Username is taken' : error = null)
        .catch(err => error = err);

    return error;
}