var { AcountModel, userModel } = require('../model/account')
var jwt = require('jsonwebtoken')



let generateToken = data => {
    var { _id, username } = data;
    var token = jwt.sign({ _id, username }, '12345', { expiresIn: '15s' });
    var refreshToken = jwt.sign({ _id, username }, '12345', { expiresIn: '20s' })
    return { token, refreshToken }
}
const updateRefreshToken = (data, refreshToken) => {
    AcountModel.findOneAndUpdate({ username: data.username }, { refreshToken: refreshToken })
        .then(data => {
            return console.log('luu refreshToken thanh cong', data)
        })
        .catch(err => {
            console.log('loi luu refresh token', err)
        })
}

var login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AcountModel.findOne({
        username: username,
        password: password
    })
        .then(data => {
            console.log('check data truyen vao: ', data)
            if (data) {
                var token = generateToken(data)
                updateRefreshToken(data, token.refreshToken)
                // console.log("data sau khi da luu vao db", data)
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
module.exports = { login, generateToken, updateRefreshToken };