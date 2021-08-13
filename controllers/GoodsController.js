const db = require('../db');
const Goods = db.models.goods;

exports.getInfo = function (req, res) {
    if (req.body.key.length !== 0) {
        Goods.findAll({
            where: {
                id: req.body.key
            }
        }).then(result => {
            let goods = {};
            for (let i = 0; i < result.length; i++) {
                goods[result[i]['id']] = result[i];
            }
            res.json(goods);
        }).catch(err => {
            throw(err);
        })
    } else {
        res.send('0');
    }
}
