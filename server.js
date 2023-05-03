var express = require('express');
var app = express();
var router = require('./src/router/router')
var routerUser = require('./src/router/acount')
const path = require('path')
var login = require('./src/middleware/login')
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


// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         console.log(username, password)
//         AcountModel.findOne({
//             username: username,
//             password: password
//         })
//             .then(data => {
//                 if (!data) done(null, false)
//                 done(nul, data)
//             })
//             .catch(err => {
//                 done(err)
//             })

//     }))


// app.post('/passport', function (req, res, next) {
//     passport.authenticate('local', function (err, user) {
//         console.log(err)
//         if (err) { return next(err) }
//         if (!user) { return res.json('username va password khong hop le') }
//         req.user = user
//         jwt.sign({ payload: user }, '123', function (err, data) {
//             if (err) return res.status(500).json('loi server')
//             return res.json({
//                 message: 'gui tu passport',
//                 payload: data
//             })
//         })
//     }
//     )
// })

// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         User.findOne({ username: username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.verifyPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));

// app.post('/login',
//     passport.authenticate('local', { failureRedirect: '/login' }),
//     function (req, res) {
//         res.redirect('/');
//     });




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
        message: " thong bao loi ",
        status: err
    })
})
app.listen(port, function () {
    console.log(`servering running in port: ${port}`)
})