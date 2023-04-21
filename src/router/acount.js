var express = require('express')
var router = express.Router()
var { AcountModel } = require('../model/account')



router.get('/', (req, res, next) => {
    AcountModel.find()
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            next(err)
        })
})
router.get('/:id', (req, res, next) => {
    var id = req.params.id
    AcountModel.findById(id)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            // res.status.json('loi roi ma')
            next({
                message: 'loi o get id',
                status: err
            })
        })
})

router.post('/', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AcountModel.findOne({
        username: username
    })
        .then(data => {
            if (data) {
                res.status(300).json('tai khoan da ton tai, vui long tao tai khoan khac')
            } else {
                return AcountModel.create({
                    username: username,
                    password: password
                })
            }
        })
        .then(data => {
            res.status(200).json({
                message: 'tao tai khoan thanh cong',
                payload: data
            })
        })
        .catch(err => {
            next(err)
        })
})
router.put('/:id', (req, res, next) => {
    var id = req.params.id
    var newPassword = req.body.newPassword

    AcountModel.findByIdAndUpdate(id, {
        password: newPassword
    })
        .then(data => {
            res.json({
                message: 'sua thanh cong',
                payload: data
            })
        })
        .catch(err => {
            res.status(300).json('khong sua duoc')
        })
})
router.delete('/account/:id', (req, res, next) => {
    console.log(req.params.id)
    var id = req.params.id
    AcountModel.findById(id)
        .then(data => {
            if (data) {
                return AcountModel.deleteOne({
                    _id: id
                })
            } else {
                return res.status(300).json('tai khoan khong ton tai')
            }
        })
        .then(data => {
            res.json({
                message: 'xoa thanh cong',
                paload: data
            })
        })
        .catch(err => {
            // res.status(500).json('loi roi')
            next(err)
        })
})
module.exports = router