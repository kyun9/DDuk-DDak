var express = require('express');
var conn = require('./config/db')();
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index',{user:req.user});

});

module.exports = router;