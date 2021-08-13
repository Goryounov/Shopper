const db = require('../db');
const crypto = require('crypto');
const sequelize = db.models.sequelize;
const {QueryTypes} = require("sequelize");
const User = db.models.user;

exports.signup = function (req, res) {
    User.findOne({where: {login: req.body.login}}).then(user => {
        if (user) {
            res.render('signup', {messageError: "Пользователь с таким логином уже существует!"});
        } else {

            let salt = crypto.randomBytes(16).toString('hex');
            let hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`).toString(`hex`);

            User.create({
                login: req.body.login,
                password: hash,
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                salt: salt
            }, {fields: ['login', 'password', 'first_name', 'last_name', 'salt']})
                .then(() => {
                    res.render('signup', {messageSuccess: "Вы успешно зарегистрировались!"});
                })
                .catch(err => {
                    throw(err);
                })
        }
    }).catch(err => {
        throw(err);
    })
};

exports.login = function (req, res) {

    User.findOne({
        where: {
            login: req.body.login,
        }
    }).then(user => {
            if (!user) {
                console.log('Error: User not found');
                res.render('login', {message: "Неправильно введены логин и/или пароль"});
            } else {
                let hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, `sha512`).toString(`hex`);

                if(hash === user.password) {
                    let hash = crypto.randomBytes(16).toString('hex');;
                    res.cookie('hash', hash);
                    res.cookie('id', user.id);
                    User.update({ hash: hash }, {
                        where: {
                            id: user.id
                        }
                    }).then(result => {
                        if (user.login === 'admin') res.redirect('/admin');
                        else res.redirect('/user');
                    }).catch(err => {
                        throw(err);
                    });
                } else {
                    console.log('Error: User not found');
                    res.render('login', {message: "Неправильно введены логин и/или пароль"});
                }
            }
        }
    ).catch(err => {
        throw(err);
    })
};

exports.logout = function (req, res) {
    res.clearCookie('id');
    res.clearCookie('hash');
    res.redirect('back');
};

exports.index = function (req, res) {

    let userId = req.user.id;
    let groupByDate = groupBy("date");

    sequelize.query(`SELECT *
                     FROM orders
                              LEFT JOIN goods ON goods.id = orders.goods_id
                              LEFT JOIN users ON users.id = orders.user_id
                     WHERE user_id = ${userId}`, {
        type: QueryTypes.SELECT,
        raw: true
    })
        .then(
            orders => {
                let formattedOrders = Object.values(groupByDate(orders));
                res.render('user', {
                    orders: formattedOrders,
                    auth: req.user
                });
            }
        )
        .catch(err => {
            throw(err);
        });
}

exports.update = function (req, res) {
    User.update({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    }, {
        where: {
            login: req.user.login
        }
    }).then(() => {
        User.findOne({where: {login: req.user.login}}).then(user => {
            res.status(200).render('user', {
                message: 'Данные успешно изменены!',
                auth: user
            });
        }).catch(err => {
            throw err;
        })
    }).catch(err => {
        throw err;
    });
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
