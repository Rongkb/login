var { AcountModel, userModel } = require('../model/account')

const getUser = (req, res, next) => {
    const PAGE_SIZE = 4
    console.log(req.query.page)
    var page = req.query.page;
    if (page) {
        if (page < 1) {
            page = 1
        }
        page = parseInt(page)
        var skip = (page - 1) * PAGE_SIZE
        console.log(PAGE_SIZE)
        console.log(skip)
        AcountModel.find({})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        AcountModel.find({})
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                console.log(err)
            })
    }


}

module.exports = getUser