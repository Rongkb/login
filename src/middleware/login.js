var { AcountModel, userModel } = require('../model/account')
var jwt = require('jsonwebtoken')

var login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AcountModel.findOne({
        username: username,
        password: password
    })
        .then(data => {
            console.log(data)
            if (data) {
                var token = jwt.sign({ payload: data }, '12345',)
                res.send({
                    message: 'gui token thanh cong',
                    token: token
                })
                // next()
            } else {
                res.status(300).json('tai khoan hoac mat khau khong dung')
                // next('loi')
            }
        })
        .catch(err => {
            next({
                message: 'loi phan check login',
                status: err
            })
        })

}
module.exports = login;