const db = require("../db");
const Goods = db.models.goods;
const Category = db.models.category;

exports.index = function (req, res) {

    let goods = Goods.findAll().catch(err => {
        console.log(err);
        throw(err);
    })

    let categories = Category.findAll().catch(err => {
        console.log(err);
        throw(err);
    })

    Promise.all([goods, categories]).then(value => {
        res.render('index', {
            goods: value[0],
            category: value[1],
            auth: req.user
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.category = function (req, res) {
    Category.findByPk(req.query.id)
        .then(category => {
            if (!category) throw('Not found');
            category.getGoods().then(goods => {
                res.render('cat', {
                    category: category,
                    goods: goods,
                    auth: req.user
                });
            }).catch(err => {
                throw(err);
            });
        }).catch(err => {
        throw(err);
    });
}

exports.goods = function (req, res) {

    let goodId = req.query.id;

    Goods.findByPk(goodId)
        .then(goods => {
            if (!goods) throw('Not found');
            goods.getCategories().then(category => {
                res.render('goods', {
                    goods: JSON.parse(JSON.stringify(goods)),
                    category: category,
                    auth: req.user
                });
            }).catch(err => {
                throw(err);
            });
        }).catch(err => {
        throw(err);
    });
}

exports.login = function (req, res) {
    res.render('login');
}

exports.signup = function (req, res) {
    res.render('signup');
}

exports.payment = function (req, res) {
    res.render('payment');
}

exports.shipping = function (req, res) {
    res.render('shipping');
}