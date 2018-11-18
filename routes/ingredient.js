      module.exports = function() {
        var route = require('express').Router();
        route.get('/', function(req, res) {
          res.render('ingredient');
        });
        return route;
      };
