module.exports = function () {
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var route = require('express').Router();
    var conn = require('./config/db')();

    route.get('/', function (req, res) {
        res.render('mypage', {
            user: req.user,
            update: false
        });
    });
    route.route('/update').post(function (req, res) {
        var displayName = (req.body.id).trim();
        var email = req.body.email;
        hasher({
            password: req.body.password
        }, function (err, pass, salt, hash) {
            console.log(err, pass, salt, hash);
            var password = hash;
            var saltt = salt;
            conn.beginTransaction(function () {
                conn.query("update users set email='" + email + "', password='" + password + "', salt='" + saltt + "' where displayName=?", [displayName], function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.render('mypage', {
                                    user: req.user,
                                    update: true
                                });
                            }
                        });
                    }
                });
            });
        });
    });
    return route;
};
