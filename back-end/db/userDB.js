const { ObjectID } = require('bson');
let client;

module.exports = (mongoClient) => {
    client = mongoClient;

    return {
        register: register,
        getUser: getUser,
        isValidUser: isValidUser,
        getUserById: getUserById
    };
};

const register = async user => {
    // Register
    let newUser = {
        username: user.username, 
        password: user.password,
        firstName: user.firstName, 
        lastName: user.lastName,
        intro: user.intro
        // createdAt: user.createdAt,
    };

    let response;
    await client.db('blogDB').collection('users').insertOne(newUser)
        .then(data => response = data.insertedCount) // 0 if not inserted, 1 if it did
        .catch(err => response = err);

    return response;
}

const getUser = async (username, password) => {
    const query = { username: username, password: password };

    let user;
    await client.db('blogDB').collection('users').findOne(query)
        .then(data => data === null ? user = 'Incorrect login details' : user = data)
        .catch(err => res.send(err));

    return user;
}

const isValidUser = async username => {
    const query = { username: username };
    let error = '';

    await client.db('blogDB').collection('users').findOne(query)
        .then(data => data !== null ? error = 'Username is taken' : error = null)
        .catch(err => error = err);

    return error;
}

const getUserById = async userId => {
    let user;
    await client.db('blogDB').collection('users').findOne({ _id: ObjectID(userId) })
        .then(res => user = res)
        .catch(err => { console.log(err); res.status(404).json({ error: 'User not found' }); });

    return user;
}