      module.exports = function() {
        var route = require('express').Router();
        route.get('/', function(req, res) {
          res.render('recommend',{user:req.user});
        });
        return route;
      };
