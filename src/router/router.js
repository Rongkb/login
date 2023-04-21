var express = require('express')
var router = express.Router()
var AcountController = require('../controller/acountController')
var checkLogin = require('../middleware/checkLogin')
var getUser = require('../controller/getUserController')

router.get('/user', getUser)
router.post('/register', AcountController)
router.get('/register', AcountController)
router.post('/login', checkLogin, (req, res, next) => {
    res.json('heloo')
})

module.exports = router;