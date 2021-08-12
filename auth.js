const db = require('./db');
const User = db.models.user;

module.exports = {
    checkAuth: function (req, res, next) {
        User.findByPk(req.cookies.id)
            .then(user => {
                if (user === null) {
                    return next('Not found');
                }
                if (user.hash == req.cookies.hash && user.id == req.cookies.id) {
                    req.user = user;
                    next();
                } else {
                    next('Not found');
                }
            }).catch(err => {
            throw err;
            next(err);
        })
    },
    requireAuth: function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    },
    isAdmin: function (req, res, next) {
        User.findByPk(req.user.id)
            .then(user => {
                if (!user) throw('Not found');
                user.getRoles().then(roles => {
                    if (roles[0]) {
                        next();
                    } else {
                        res.redirect('/404');
                    }
                }).catch(err => {
                    throw(err);
                });
            }).catch(err => {
            throw(err);
        });
    }
}
