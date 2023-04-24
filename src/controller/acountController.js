var { AcountModel, userModel } = require('../model/account')


const creatAcount = async (req, res, next) => {
    try {
        var username = req.body.username;
        var password = req.body.password

        if (!username || !password) {
            return next({
                errCode: 01,
                message: 'vui long dien day du thong tin'
            })
        }
        var userIsExits = await AcountModel.findOne({
            username: username
        })
        if (userIsExits) {
            return next({
                errCode: 01,
                message: 'tai khoan da ton tai vui long chon tai khoan khac'
            })
        }
        const isCreate = await AcountModel.create({
            username: username,
            password: password
        })
        res.send({
            errCode: 0,
            message: 'dang ky thanh cong',
            data: isCreate
        })


    } catch (error) {
        next({
            errCode: 01,
            message: 'loi roi'
        })
    }




}
module.exports = creatAcount;