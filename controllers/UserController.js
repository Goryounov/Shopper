const db = require('../db');
const sequelize = db.models.sequelize;
const {QueryTypes} = require("sequelize");
const User = db.models.user;

exports.signup = function (req, res) {
    User.findOne({where: {login: req.body.login}}).then(user => {
        if (user) {
            res.render('signup', {messageError: "Пользователь с таким логином уже существует!"});
        } else {
            User.create({
                login: req.body.login,
                password: req.body.password,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            }, {fields: ['login', 'password', 'first_name', 'last_name']})
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

    User.findAll({
        where: {
            login: req.body.login,
            password: req.body.password
        }
    }).then(user => {
            if (user.length == 0) {
                console.log('Error: User not found');
                res.render('login', {message: "Неправильно введены логин и/или пароль"});
            } else {
                let hash = makeHash(32);
                res.cookie('hash', hash);
                res.cookie('id', user[0].id);
                /**
                 * write hash to db
                 */
                User.update({ hash: hash }, {
                    where: {
                        id: user[0].id
                    }
                }).then(result => {
                    if (result[0]['login'] === 'admin') res.redirect('/admin');
                    else res.redirect('/user');
                }).catch(err => {
                    throw(err);
                });
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
        first_name: req.body.first_name,
        last_name: req.bind.last_name,
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

function makeHash(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
