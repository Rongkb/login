var { AcountModel, userModel } = require('../model/account')


const creatAcount = (req, res, next) => {
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password
    AcountModel.findOne({
        username: username
    }).then(data => {
        if (data) {
            res.json('tai khoan da ton tai vui long tao tai khoan khac')
        } else {
            return AcountModel.create({
                username: username,
                password: password
            })
        }
    })
        .then(data => {
            res.json({
                message: 'tao tai khoan thanh cong',
                data: data
            })
        })

        .catch(err => {
            // res.status(500).json('loi ben sercver')
            next(err)
        }

        )
    // userModel.find()
    //     .then(data => {
    //         res.json({
    //             message: 'tim thay',
    //             data: data
    //         })
    //     }).catch(err => {
    //         res.status(500).json('khong tim thay')
    //     })

}
module.exports = creatAcount;