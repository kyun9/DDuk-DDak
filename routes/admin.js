module.exports = function () {
    var route = require('express').Router();
    var conn = require('./config/db')();

    route.get('/adminMain', function (req, res) {
        res.render('admin/adminMain', {
            user: req.user
        });
    });
    route.get('/adminUser', function (req, res) {
        var sql = 'select id, displayName, username, email from users where displayName not in("admin")';

        conn.query(sql, function (err, rows) {
            res.render('admin/adminUser', {
                user: req.user,
                rows: rows
            });
        })
    });
    route.get('/userDelete/:userId', function (req, res) {
        var id = req.params.userId;
        conn.beginTransaction(function () {
            conn.query('delete from users where id=?', [id], function (err) {
                if (err) {
                    console.log(err);
                } else {
                    conn.commit(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/admin/adminUser');
                        }
                    });
                }
            });
        });
    });
    return route;
};
