const { ObjectID } = require('bson');
let client;

module.exports = (mongoClient) => {
    client = mongoClient;

    return {
        register: register,
        getUser: getUser,
        isValidUser: isValidUser,
        getUserById: getUserById,
        getImageByUserId: getImageByUserId,
        updateImageByUserId: updateImageByUserId,
        updateUserDetails: updateUserDetails
    };
};

const register = async user => {
    // Register
    let newUser = {
        username: user.username, 
        password: user.password,
        firstName: user.firstName, 
        lastName: user.lastName,
        intro: user.intro,
        img: user.img
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
        .then(data => data !== null ? error = 'Username is taken.' : error = null)
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

const getImageByUserId = async userId => {
    const query = { _id: ObjectID(userId) };

    let imageString = null;
    if (userId !== null && userId !== undefined)
        await client.db('blogDB').collection('users').findOne(query)
            .then(data => data !== null ? imageString = data.img : null)
            .catch(err => imageString = err);

    return imageString;
}

const updateImageByUserId = async (userId, img) => {
    let results = "";
    await client.db('blogDB').collection('users').updateOne({ _id: ObjectID(userId) }, { $set: { img: img } })
        .then(data => results = "Image updated successfully.")
        .catch(err => {
            console.log(err);
            results = "Failed to update image.";
        });

    return results;
}

const updateUserDetails = async (userId, body) => {
    let results = "";
    let { ...user } = body;

    await client.db('blogDB').collection('users').updateOne({ _id: ObjectID(userId) }, { $set: { ...user } })
        .then(data => results = "User updated successfully.")
        .catch(err => {
            console.log(err);
            results = "Failed to update user.";
        });

    return results;
}