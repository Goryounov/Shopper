const db = require("../db");
const sequelize = db.models.sequelize;
const {QueryTypes} = require("sequelize");
const Goods = db.models.goods;

exports.index = function (req, res) {
    res.render('admin', {auth: req.user});
}

exports.orders = function (req, res) {

    let groupByDate = groupBy("date");

    sequelize.query('SELECT * FROM orders LEFT JOIN goods ON goods.id = orders.goods_id LEFT JOIN users ON users.id = orders.user_id', { type: QueryTypes.SELECT, raw: true })
        .then(
            orders => {
                let formattedOrders = Object.values(groupByDate(orders));
                res.render('admin-orders', {
                    orders: formattedOrders,
                    auth: req.user
                })
            }
        )
        .catch(err => {
            throw(err);
        });
}


exports.goods = function (req, res) {
    Goods.findAll().then(goods => {
        res.render('admin-goods', {
            goods: goods,
            auth: req.user
        })
    }).catch(err => {
        throw(err);
    })
}

function groupBy(key) {
    return function group(array) {
        return array.reduce((acc, obj) => {
            const property = obj[key];
            acc[property] = acc[property] || [];
            acc[property].push(obj);
            return acc;
        }, {});
    };
}


