      module.exports = function() {
        var route = require('express').Router();
          
          
          
        route.get('/login', function(req, res) {
          res.render('admin/login',{user:req.user});
        });
          
        route.get('/main', function(req, res) {
          res.render('admin/main',{user:req.user});
        });
          
        return route;
      };
