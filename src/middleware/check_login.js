var jwt = require('jsonwebtoken')

function check_login(req, res, next) {
    console.log(req.cookies)
    try {
        var token = req.cookies.token
        var decoded = jwt.verify(token, '12345')
        if (decoded) {
            req.decoded = decoded
            req.data = token
            next()
        }
    } catch (err) {
        next({
            message: 'ban can dang nhap lai',
            status: err
        })
    }
}
module.exports = check_login