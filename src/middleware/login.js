var { AcountModel, userModel } = require('../model/account')

var login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AcountModel.findOne({
        username: username,
        password: password
    })
        .then(data => {
            if (data) {
                req.data = data
                // res.json('dang nhap thanh cong')
                next()
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