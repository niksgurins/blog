let userDB;

module.exports = (injectedUserDB) => {
    userDB = injectedUserDB;

    return {
        registerUser: registerUser,
        login: login
    };
};

async function registerUser(req, res) {
    let error = await userDB.isValidUser(req.body.username)
    if (error) {
        const message = error
            ? "Something went wrong!"
            : "This user already exists!";

        sendResponse(res, message);

        return;
    }

    let response = await userDB.register(req.body);
    sendResponse(
        res,
        response ? "Success!" : "Something went wrong"
    );
}

function login(query, res) {}

function sendResponse(res, message) {
    res.status(message !== 'Success!' ? 400 : 200).json({
        message: message
    });
}