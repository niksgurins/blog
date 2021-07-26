let client;
let userDB;

module.exports = (mongoClient) => {
    client = mongoClient;
    userDB = require('./userDB')(client);

    return {
        getAllPosts: getAllPosts,
        getPostById: getPostById,
        getLatestPostId: getLatestPostId,
        getsPostsByUserId: getsPostsByUserId
    };
};

const getAllPosts = async () => {
    const posts = await client.db('blogDB').collection('posts').find().sort({ 'postId':-1 }).limit(12).toArray();
    const postsWithUserData = await addRelevantUserInfoToPosts(posts);
    return postsWithUserData;
}

const getPostById = async postId => {
    const query = { postId: parseInt(postId) };
    let results = '';

    await client.db('blogDB').collection('posts').findOne(query)
        .then(data => results = data)
        .catch(err => err);

    return results;
}

const getLatestPostId = async () => {
    let postId = -1;
    const cursor = client.db('blogDB').collection('posts').find({})
        .sort({ 'postId':-1 }).limit(1);

    await cursor.forEach(item => {
        postId = item.postId;
    });

    return postId;
}

const getsPostsByUserId = async (userId, limit) => {
    const posts = await client.db('blogDB').collection('posts').find({ authorId: userId })
        .sort({ 'postId':-1 }).limit(limit).toArray();
    const postsWithUserData = await addRelevantUserInfoToPosts(posts);
        
    return postsWithUserData;
}

const addRelevantUserInfoToPosts = async posts => {
    let results = [];

    for (let i=0; i<posts.length; i++) {
        let user = await userDB.getUserById(posts[i].authorId);
        
        if(user !== undefined && user !== null)
            results[i] = {...posts[i], authorFirstName: user.firstName, authorLastName: user.lastName};
        else
            results[i] = {...posts[i], authorFirstName: '', authorLastName: ''};
    }

    return results;
}