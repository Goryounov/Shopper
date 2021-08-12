const db = require('../db');
const Order = db.models.order;
const User = db.models.user;
const nodemailer = require('nodemailer');
const userController = require('../controllers/UserController');

const QueryTypes = require('sequelize');
const sequelize = db.models.sequelize;


exports.order = function (req, res) {
    if(req.user) {
        res.render('order', {
            auth: req.user
        });
    } else {
        res.render('order_no_auth', {
        });
    }
}

exports.finishOrder = function (req, res) {
    if (req.body.key.length !== 0) {
        let key = Object.keys(req.body.key);

        sequelize.query('SELECT id,name,cost FROM goods WHERE id IN (' + key.join(',') + ')', { type: QueryTypes.SELECT })
            .then(
                goods => {
                    // sendMail(req.body, order).catch(console.error);
                    saveOrder(req, goods, res);
                }
            )
            .catch(err => {
                throw(err);
            });
    } else {
        res.send('0');
    }
}

async function sendMail(data, result) {
    let res = '<h2>Order in Lite Shop</h2>';
    let total = 0;
    for (let i = 0; i < result.length; i++) {
        res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} uah </p>`;
        total += result[i]['cost'] * data.key[result[i]['id']];
    }
    // console.log(res);
    res += '<hr>';
    res += `Total: ${total} uah`;
    res += `<hr>Phone: ${data.phone}`;
    res += `<hr>Username: ${data.username}`;
    res += `<hr>Address: ${data.address}`;
    res += `<hr>Email: ${data.email}`;

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    let mailOption = {
        from: '<goryounow@gmail.com>',
        to: "goryuns@yandex.ru," + data.email,
        subject: "Lite shop order",
        text: 'Nodemailer test',
        html: res
    };

    let info = await transporter.sendMail(mailOption);
    console.log("MessageSent: %s", info.messageId);
    console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));
    return true;
}

function saveOrder(req, result, res) {

    if(req.user) {
        userController.update(req, res)
        createOrder(req, res, result, req.user.id);
    }
    else {
        User.findOne({where: {login: req.body.email}}).then(user => {
            if(user) {
                console.log('Такой пользователь уже есть');
                res.send('2');
            } else {
                User.create({
                    login: req.body.email,
                    email: req.body.email,
                    password: '123',
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    address: req.body.address,
                    phone: req.body.phone
                }, {fields: ['login', 'email', 'password', 'first_name', 'last_name', 'address', 'phone']})
                    .then(user => {
                        createOrder(req, res, result, user.id);
                    })
                    .catch(err => {
                        throw(err);
                    })
            }
        }).catch(err => {
            throw(err);
        })

    }
}

function createOrder(req, res, result, userId) {
    let date = new Date();
    for (let i = 0; i < result.length; i++) {
        Order.create({
            user_id: userId,
            goods_id: result[i]['id'],
            goods_cost: result[i]['cost'],
            goods_amount: req.body.key[result[i]['id']],
            total: req.body.key[result[i]['id']] * result[i]['cost'],
            date: date
        }, {fields: ['user_id', 'goods_id', 'goods_cost', 'goods_amount', 'total', 'date']})
            .then(() => {
                console.log("1 record inserted");
                res.send('1');
            })
            .catch(err => {
                throw(err);
            });
    }
}