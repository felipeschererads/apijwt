require("dotenv").config();
const mongoose = require('mongoose')

//useMongoClient: true
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })

mongoose.Promise = global.Promise;

module.exports = mongoose;