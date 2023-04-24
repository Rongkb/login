var jwt = require('jsonwebtoken')

function check_login(req, res, next) {
    console.log(req.cookies)
    try {
        var token = req.cookies.token
        var ketQua = jwt.verify(token, '12345')
        if (ketQua) {
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