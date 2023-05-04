var express = require('express');
var app = express();
var router = require('./src/router/router')
var routerUser = require('./src/router/acount')
const path = require('path')
var { login, generateToken, updateRefreshToken } = require('./src/middleware/login')
var check_login = require('./src/middleware/check_login')
var jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
// var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy;

require('dotenv').config()
const port = process.env.PORT || 8081
app.use(cookieParser())
require('./src/helper/connection_multi_mongodb')
var bodyParser = require('body-parser');
const { AcountModel } = require('./src/model/account');


app.use('/static', express.static(path.join(__dirname, 'src/public')))

app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
})


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/home.html'))
})
app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/login.html'))
})
app.post('/login', login)
app.delete('/loguot', check_login, async (req, res, next) => {
    console.log(req.decoded)
    const user = await AcountModel.findOne({
        username: req.decoded.username
    })
    console.log(user)
    updateRefreshToken(user, null)

    res.json('logout')
})
app.get('/register', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/register.html'))
})
app.post('/token', (req, res, next) => {
    const refreshToken = req.body.refreshToken
    // console.log('refershtoken tu server', refreshToken)
    if (!refreshToken) return res.json('phia client de mat ma rft roi con dau')

    const user = AcountModel.findOne({
        refreshToken: refreshToken

    })
    if (!user) return res.json('token bi gia mao roi')

    try {
        const decoded = jwt.verify(refreshToken, '12345')
        if (!decoded) return res.json('refreshtoken het han roi')
        // console.log('decoded: ', decoded)
        const tokens = generateToken(user)
        generateToken(user, tokens.refreshToken)
        res.json({
            message: 'tao moi token thanh cong',
            tokens: tokens
        })

    } catch (error) {
        console.log('loi tu lay token moi', err)
    }

})

app.get('/private', check_login, (req, res, next) => {

    res.send({
        errCode: 0,
        data: req.data
    })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/user/', routerUser)
app.use('/api/', router)
app.use((err, req, res, next) => {
    res.status(500).json({
        message: " thong bao loi tu server ",
        status: err
    })
})
app.listen(port, function () {
    console.log(`servering running in port: ${port}`)
})