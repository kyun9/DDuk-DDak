      module.exports = function() {
        var route = require('express').Router();
          
          
          
        route.get('/', function(req, res) {
          res.render('board/board',{user:req.user});
        });
          
        route.get('/writing', function(req, res) {
          res.render('board/writing',{user:req.user});
        });
          
        return route;
      };
