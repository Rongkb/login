


const mongoose = require('mongoose');

function newConnection(url) {
    const conn = mongoose.createConnection(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    conn.on('connected', function () {
        console.log(`mongodb:::: connecte::: ${this.name}`)
    });
    conn.on('disconnected', function () {
        console.log('monodb:::: disconnected');
    });
    conn.on('eror', function () {
        console.log('mongodb:::: error')
    });
    process.on('SIGNT', async () => {
        await conn.close();
        process.exit(0);
    })
    return conn;
}
const testConnection = newConnection(process.env.MONGODB_SERVER);
const userConnection = newConnection(process.env.MONGODB_USER);

module.exports = {
    testConnection,
    userConnection
}