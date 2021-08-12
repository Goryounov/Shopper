const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const auth = require('./auth');
const db = require("./db");
const connection = db.con;
const sequelize = db.models.sequelize;
const Goods = db.models.goods;


const homeRouter = require('./routes/HomeRouter');
const orderRouter = require('./routes/OrderRouter');
const userRouter = require('./routes/UserRouter');
const adminRouter = require('./routes/AdminRouter');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

app.set('view engine', 'pug');

sequelize.sync().then(() => {
    app.listen(3000, function () {
        console.log("Нода запущена");
    });
}).catch(err => console.log(err));

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// app.use(function (req, res, next) {
//     auth.checkAuth(req, res, function (err, data) {
//         if (err) {
//             return false;
//             next();
//         }
//         req.user = data;
//         next();
//         //res.render('admin', {data:data});
//     });
// });

app.use((req, res, next) => {
    auth.checkAuth(req, res, (err) => {
        if (err) {
            return next();
        }
        next();
    })
});

app.use("/", homeRouter);
app.use("/", userRouter);
app.use("/", orderRouter);
app.use("/admin", adminRouter);

app.post('/get-good-info', function (req, res) {
    if (req.body.key.length != 0) {

        Goods.findAll({
            where: {
                id: req.body.key
            }
        }).then(result => {
            let goods = {};
            for (let i = 0; i < result.length; i++) {
                goods[result[i]['id']] = result[i];
            }
            //console.log(result)
            res.json(goods);
        }).catch(err => {
            throw(err);
        })

        // connection.query('SELECT id, name, cost FROM goods WHERE id IN (' + req.body.key.join(',') + ')',
        //     function (error, result, fields) {
        //         if (error) throw error;
        //         let goods = {};
        //         for (let i = 0; i < result.length; i++) {
        //             goods[result[i]['id']] = result[i];
        //         }
        //         res.json(goods);
        //     });
    } else {
        res.send('0');
    }
});

app.get('*', function (req, res) {
    res.status(404).render('404');
});

