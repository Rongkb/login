var express = require('express');
var app = express();
var router = require('./src/router/router')
var routerUser = require('./src/router/acount')
const path = require('path')

require('dotenv').config()
const port = process.env.PORT || 8081
require('./src/helper/connection_multi_mongodb')
var bodyParser = require('body-parser')

// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/static', express.static(path.join(__dirname, 'src/public')))

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/home.html'))
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/user/', routerUser)
app.use('/api/', router)
app.use((err, req, res, next) => {
    res.status(500).json(err)
})
app.listen(port, function () {
    console.log('servering running')
})