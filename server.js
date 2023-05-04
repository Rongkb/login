var express = require('express');
var app = express();
var router = require('./src/router/router')
var routerUser = require('./src/router/acount')
const path = require('path')
var { login, generateToken, updateRefreshToken } = require('./src/middleware/login')
var check_login = require('./src/middleware/check_login')
var jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

require('dotenv').config()
const port = process.env.PORT || 8081
app.use(cookieParser())
require('./src/helper/connection_multi_mongodb')
var bodyParser = require('body-parser');
const { AcountModel } = require('./src/model/account');


app.use('/static', express.static(path.join(__dirname, 'src/public')))
// cors
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


app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

app.post("/passport", passport.authenticate('local', {
    failureRedirect: "/login",
    successRedirect: '/'
}));

passport.use(new LocalStrategy((username, password, done) => {
    var user = AcountModel.findOne({ username: username })
    if (user) {
        return done(null, user)
    } else {
        return done(null, false)
    }
}
))


// Mã hoá và giải mã những giá trị của người dùng
passport.serializeUser(function (user, done) {
    done(null, user._id);
});


// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

// //   Chiến lược login
// // passport/login.js 
// passport.use('login', new LocalStrategy({
//     passReqToCallback: true
// },
//     function (req, username, password, done) {
//         // check in mongo if a user with username exists or not 
//         User.findOne({ 'username': username },
//             function (err, user) {
//                 // In case of any error, return using the done method 
//                 if (err)
//                     return done(err);
//                 // Username does not exist, log error & redirect back 
//                 if (!user) {
//                     console.log('User Not Found with username ' + username);
//                     return done(null, false,
//                         req.flash('message', 'User Not found.'));
//                 }
//                 // User exists but wrong password, log the error 
//                 if (!isValidPassword(user, password)) {
//                     console.log('Invalid Password');
//                     return done(null, false,
//                         req.flash('message', 'Invalid Password'));
//                 }
//                 // User and password both match, return user from 
//                 // done method which will be treated like success 
//                 return done(null, user);
//             }
//         );
//     }));

// // Chiến lược đăng ký
// passport.use('signup', new LocalStrategy({
//     passReqToCallback: true
// })),
//     function (req, username, password, done) {
//         findOrCreateUser = function () {
//             // find a user in Mongo with provided username 
//             User.findOne({ 'username': username }, function (err, user) {
//                 // In case of any error return 
//                 if (err) {
//                     console.log('Error in SignUp: ' + err);
//                     return done(err);
//                 }
//                 // already exists 
//                 if (user) {
//                     console.log('User already exists');
//                     return done(null, false,
//                         req.flash('message', 'User Already Exists'));
//                 } else {
//                     // if there is no user with that email 
//                     // create the user 
//                     var newUser = new User();
//                     // set the user's local credentials 
//                     newUser.username = username;
//                     newUser.password = createHash(password);
//                     newUser.email = req.param('email');
//                     newUser.firstName = req.param('firstName');
//                     newUser.lastName = req.param('lastName');
//                     // save the user 
//                     newUser.save(function (err) {
//                         if (err) {
//                             console.log('Error in Saving user: ' + err);
//                             throw err;
//                         }
//                         console.log('User Registration succesful');
//                         return done(null, newUser);
//                     });
//                 }
//             });
//         }
//     };

// // Delay the execution of findOrCreateUser and execute 
// // the method in the next tick of the event loop 
// process.nextTick(findOrCreateUser);



// app.post("/passport", passport.authenticate('local', {
//     failureRedirect: "/login",
//     successRedirect: '/'
// }));

// let initPassportLocal = () => {
//     passport.use(new LocalStrategy({

//     }, async (req, email, password, done) => {
//         try {
//             let user = await UserModel.findByEmail(email);
//             if (!user) {
//                 return done(null, false);
//             }

//             let checkPassword = await (user.comparePassword(password));

//             if (!checkPassword) {
//                 return done(null, false);
//             }

//             return done(null, user);
//         } catch (error) {
//             console.log(error);
//             return done(null, false,);
//         }
//     }));
// };







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