module.exports = function(app) {
  var conn = require('./db')();
  var bkfd2Password = require('pbkdf2-password');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var hasher = bkfd2Password();

  app.use(passport.initialize()); /*-----------passport 셋팅----------*/
  app.use(passport.session()); /*-----------session 사용하겠다. use session 뒷편에 붙어야함.----------*/

  passport.serializeUser(function(user, done) { //user라는 인자는 아래 passport.use의 done(null, user)의 user
    console.log('serializeUser', user);
    done(null, user.authId); //user.id가 보편적이지만 우린 id값 없으니 username(ID는 사실 고유 식별자이기도해서)으로 쓰자.
  });
  //serailizeUser가 수행되고서 function()아래의 콜백함수가 실행되도록 되어잇음.
  passport.deserializeUser(function(id, done) { //위의 user.username이 id값으로 들어옴.
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results) {
      if (err) {
        console.log(err);
        done('There is no user.');
      } else {
        done(null, results[0]);
      }
    });
  });
  passport.use(new LocalStrategy( //local이라는 전략을 만드는 것.(객체를 만드는 거야)
    function(username, password, done) { //콜백 함수를 받는다, 3가지 입력값(사용자가 실제 사용자인지 아닌지 성공, 실패를 판단한다.) //done은 끝났다라는 뜻 ㅋ
      var uname = username; //기존의 사용자가 맞는 확인하는 코드
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, ['local : ' + uname], function(err, results) {
        console.log(results); //생략가능
        if (err) {
          return done('There is no user.');
        }
        var user = results[0];
        return hasher({
          password: pwd,
          salt: user.salt
        }, function(err, pass, salt, hash) {
          if (hash === user.password) {
            console.log('LocalStrategy', user);
            done(null, user); // done은 끝났다라는 뜻 , null은 err처리할때, 두번째인자 1.로그인된 사용자의 정보를 담고 있는 객체 2.user가는 false가 아니라면 로그인 성공
          } //로그인 절차가 끝났는데 성공했고 사용자 정보를 user에 담고 있는 객체로 사용될거임.
          else {
            done(null, false); // 로그인절차가 끝났는데  실패

          }
        });
      });
    }
  ));
  return passport;
}
