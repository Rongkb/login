const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../helper/connect_mongodb')
const { testConnection, userConnection } = require('../helper/connection_multi_mongodb')

const AcountSchema = new Schema({
    username: String,
    password: String
},
    {
        collection: 'account'
    })


const testSchema = new Schema({
    username: String,
    password: String
},
    {
        collection: "users"
    })


const userModel = userConnection.model('users', testSchema)
const AcountModel = testConnection.model('account', AcountSchema)
module.exports = { AcountModel, userModel };