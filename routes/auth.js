
module.exports = function(passport){
  var bkfd2Password =require('pbkdf2-password');
  var hasher = bkfd2Password();
  var conn = require('./config/db')();
  var route = require('express').Router();

  /*------GET방식----로그인 페이지----------*/
route.get('/login',function(req, res){
  res.render('login', {user:req.user});
  });

  /*--------local이라느 로그인 방식으로 로그인이됨.(local 대신에 facebook쓰면 facebook방식이지)----------*/
route.post(
    '/login',
    passport.authenticate( /*------new LocalStrategy를 이용해서 실행이 되는거야------*/
      'local', {
        successRedirect: '/',
        failureRedirect:  '/auth/login',
        failureFlash: false
  }));
  /*--------GET방식----회원가입 페이지----------*/
route.get('/register',function(req, res){
    res.render('register', {user:req.user});
    });

  /*--------POST방식----회원가입 페이지----------*/
route.post('/register',function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
          authId:'local : '+req.body.username,
          username:req.body.username,
          password: hash,
          salt: salt,
          displayName:req.body.displayName,
          email:req.body.email
        };
  var sql = 'INSERT INTO users SET ?';
    conn.query(sql, user, function(err, results){
      if(err){
        console.log(err);
        res.status(500);
        res.redirect('register');
      }
      else{

            res.redirect('login');

      }
    });

    });

  });

  route.get('/logout', function(req, res){      /*@@@@@@@@@@@@임시 로그아웃 페이지@@@@@@@@@@@@@@@@@@@*/
    req.logout();
    req.session.save(function(){
      res.redirect('/');
    });
  });
  return route;
};
