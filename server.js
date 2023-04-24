var express = require('express');
var app = express();
var router = require('./src/router/router')
var routerUser = require('./src/router/acount')
const path = require('path')
var login = require('./src/middleware/login')
var check_login = require('./src/middleware/check_login')
var jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
// const cors = require('cors')

require('dotenv').config()
const port = process.env.PORT || 8081
app.use(cookieParser())
require('./src/helper/connection_multi_mongodb')
var bodyParser = require('body-parser')

// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/static', express.static(path.join(__dirname, 'src/public')))

app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
})
// app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/home.html'))
})
app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/login.html'))
})
app.post('/login', login)
app.get('/register', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/register.html'))
})


app.get('/private', check_login, (req, res, next) => {
    res.send('wellcome private')
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/user/', routerUser)
app.use('/api/', router)
app.use((err, req, res, next) => {
    res.status(500).json({
        message: " thong bao loi ",
        status: err
    })
})
app.listen(port, function () {
    console.log(`servering running in port: ${port}`)
})