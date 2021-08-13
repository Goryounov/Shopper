const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const auth = require('./auth');
const db = require("./db");
const sequelize = db.models.sequelize;

const homeRouter = require('./routes/HomeRouter');
const orderRouter = require('./routes/OrderRouter');
const userRouter = require('./routes/UserRouter');
const adminRouter = require('./routes/AdminRouter');
const goodsRouter = require('./routes/GoodsRouter');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

app.set('view engine', 'pug');

sequelize.sync({ alter: true }).then(() => {
    app.listen(3000, function () {
        console.log("Server works on 3000");
    });
}).catch(err => console.log(err));

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
app.use("/", goodsRouter);
app.use("/admin", adminRouter);

app.get('*', function (req, res) {
    res.status(404).render('404');
});

