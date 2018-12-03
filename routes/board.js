      module.exports = function () {
          var route = require('express').Router();
          var conn = require('./config/db')();
          var formidable = require('formidable'); // form 태그 데이터들을 가져오는 모듈
          var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈

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

          route.post('/upload/:id', function (req, res) {
              var name = "";
              var ImgPath = "";
              var form = new formidable.IncomingForm();
              
              form.parse(req, function (err, fields, files) {
                  name = req.user.displayName;
              });

              form.on('end', function (fields, files) {
                  for (var i = 0; i < this.openedFiles.length; i++) {
                      var temp_path = this.openedFiles[i].path;
                      var file_name = this.openedFiles[i].name;
                      var index = file_name.indexOf('/');
                      var new_file_name = file_name.substring(index + 1);
                      var new_location = 'public/resources/images/' + name + '/';
                      var db_new_location = 'resources/images/' + name + '/';

                      //실제 저장하는 경로와 db에 넣어주는 경로로 나눠 주었는데 나중에 편하게 불러오기 위해 따로 나눠 주었음

                      ImgPath = db_new_location + file_name;
                      fs.copy(temp_path, new_location + file_name, function (err) { // 이미지 파일 저장하는 부분임
                          if (err) {
                              console.error(err);
                          }

                      });

                  }

                  var id = req.params.id;
                  var img = {

                      tmp: ImgPath
                  };
                  var sql = 'UPDATE users SET ? WHERE id=?';
                  conn.query(sql, [img, id], function (err, results) {
                      if (err) {
                          console.log(err);
                          res.status(500);

                      } else {

                          res.redirect('/board/writing');

                      }
                  });

              });



          });

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
              var writer = req.user.displayName;
              var title = req.body.title;
              var content = req.body.content;
              var photo = req.user.tmp;
             

              conn.beginTransaction(function (err) {
                  if (err) console.log(err);
                  conn.query('insert into board(title,writer,content,ImgPath) values(?,?,?,?)', [title, writer, content, photo], function (err) {
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
              var ImgPath = req.params.ImgPath;
              console.log("ImgPath : " + ImgPath);
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
                      conn.query('select idx,title,content,writer,ImgPath,hit,DATE_FORMAT(moddate, "%Y/%m/%d %T")' +
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





          return route;
      };
