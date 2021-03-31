// Adapted from https://developer.mongodb.com/community/forums/t/exporting-a-single-instance-of-existing-mongodb-in-node/12368
const { MongoClient } = require("mongodb")
const url = "mongodb://localhost:27017/";

let client = new MongoClient(url, { useUnifiedTopology: true })

module.exports = client;