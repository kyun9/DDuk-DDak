      module.exports = function () {
          var route = require('express').Router();
          var conn = require('./config/db')();


          route.get('/', function (req, res) {
              var sql = 'select idx,title,writer,hit,DATE_FORMAT(moddate, "%Y/%m/%d %T") as moddate from board';

              conn.query(sql, function (err, rows) {
                  if (err) console.log(err)
                  console.log('rows : ' + rows);
                  res.render('board/board', {
                      user: req.user,
                      rows: rows
                  });
              })
          });

          //          route.get('/', function (req, res) {
          //              res.render('board/board', {
          //                  user: req.user
          //              });
          //          });

          route.get('/writing', function (req, res) {
              res.render('board/writing', {
                  user: req.user
              });
          });

          route.post('/writing', function (req, res, next) {
              /*
               *POST 방식의 요청을 URL에 데이터가 포함되지 않고 BODY에 포함되어 전송됩니다.
               * 때문에 request 객체를 통해 body에 접근 후 데이터를 가지고 옵니다.
               *  */
              var body = req.body;
              var writer =req.user.displayName;
              var title = req.body.title;
              var content = req.body.content;

              conn.beginTransaction(function (err) {
                  if (err) console.log(err);
                  conn.query('insert into board(title,writer,content) values(?,?,?)', [title, writer, content], function (err) {
                      if (err) {
                          /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                          console.log(err);
                          conn.rollback(function () {
                              console.error('rollback error1');
                          })
                      }
                      conn.query('SELECT LAST_INSERT_ID() as idx', function (err, rows) {
                          if (err) {
                              /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                              console.log(err);
                              conn.rollback(function () {
                                  console.error('rollback error1');
                              })
                          } else {
                              conn.commit(function (err) {
                                  if (err) console.log(err);
                                  console.log("row : " + rows);
                                  var idx = rows[0].idx;
                                  res.redirect('/board');
                              })
                          }
                      })
                  })
              })
          })


          route.get('/read/:title', function (req, res, next) {

              var title = req.params.title;
              console.log("title : " + title);


              conn.beginTransaction(function (err) {
                  if (err) console.log(err);
                  conn.query('update board set hit=hit+1 where title=?', [title], function (err) {
                      if (err) {
                          /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                          console.log(err);
                          conn.rollback(function () {
                              console.error('rollback error1');
                          })
                      }
                      conn.query('select idx,title,content,writer,hit,DATE_FORMAT(moddate, "%Y/%m/%d %T")' +
                          ' as moddate,DATE_FORMAT(regdate, "%Y/%m/%d %T") as regdate from board where title=?', [title],
                          function (err, rows) {
                              if (err) {
                                  /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                                  console.log(err);
                                  conn.rollback(function () {
                                      console.error('rollback error2');
                                  })
                              } else {
                                  conn.commit(function (err) {
                                      if (err) console.log(err);
                                      console.log("row : " + rows);
                                      res.render('board/read', {
                                          user: req.user,
                                          rows: rows
                                      });
                                  })
                              }
                          })
                  })
              })
          });


          //          route.get('/read', function (req, res) {
          //              res.render('board/read', {
          //                  user: req.user
          //              });
          //          });

          return route;
      };
