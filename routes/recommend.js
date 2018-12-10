      module.exports = function () {
          var route = require('express').Router();
          var request = require('request');
          //          var cheerio = require('cheerio');
          //          var convert = require('xml-js');
          var xml2js = require('xml2js');
          var conn = require('./config/db')();

          var parser = new xml2js.Parser();
          const $url = 'http://api.nongsaro.go.kr/service/recomendDiet/recomendDietDtl';
          const $KEY = '20181109EQDUHW95LIXNGC1KFNTJG';
          const $cntntsNo = '89324';

          var queryParams = '?' + encodeURIComponent('apiKey') + '=' + $KEY;
          queryParams += '&' + encodeURIComponent('cntntsNo') + '=' + $cntntsNo;
          //          const $api_url = $url + '?apiKey=' + $KEY + '&cntntsNo=' + $cntntsNo;

          console.log(queryParams);


          request({
              url: $url + queryParams,
              method: 'GET'
          }, function (error, response, body) {
              //              console.log('Status', response.statusCode);
//                            console.log('Headers', JSON.stringify(response.headers));
//                            console.log('Response Received', body);
              parser.parseString(body, function (err, result) {
                  var data = result.response.body[0].items[0].item;
                  var length = data.length;
//                  var destinationHTML = "";
//                                    console.log(data);
                  
                  
                  conn.query('delete from recommendfood', function (err, results) {
                          if (err) {
                              console.log(err);
                              res.status(500);
                          } else {
                              //res.redirect('/mypage');
                          }
                      });
                  
                  
                  for (var i = 0; i < length; ++i) {
                      var fdNm = data[i].fdNm;
                      
                      //    if ('A0101' <= cat2 && cat2 <= 'A0206')
                      //    {
                      console.log(fdNm);
                      var ckngMthInfo = data[i].ckngMthInfo[0];
                      var ckngMthInfo = ckngMthInfo;
                      //        var longitude = parseFloat(data[i].mapx);
                      //        var latitude = parseFloat(data[i].mapy);
                      //        var image, tel, addr;
                      console.log(ckngMthInfo);
                      image = null;
                      if (data[i].rtnImageDc)
                          image = data[i].rtnImageDc[0];
                      console.log(image);
                      //        tel = null;
                      //        if (data[i].tel)
                      //            tel = data[i].tel[0];
                      //
                      //        addr = null;
                      //        if (data[i].addr1)
                      //            addr = data[i].addr1[0];

//                      destinationHTML += ckngMthInfo + '<br>';
                      //        destinationHTML += longitude + '<br>';
                      //        destinationHTML += latitude + '<br>';

                      //        if (tel != "")
                      //            destinationHTML += tel + '<br>';
                      //        destinationHTML += addr + '<br>';
//                      if (image != "")
//                          destinationHTML += "<img src=" + image + ">";
//                      destinationHTML += '<br><br>'

                      //    } // end category if

                      //                      conn.beginTransaction(function (err) {
                      //                          if (err) console.log(err);
                      //                          conn.query('insert into recommendfood(foodname,img,subscript) values(?,?,?)', [fdNm, image, ckngMthInfo], function (err) {
                      //                              if (err) {
                      //                                  /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                      //                                  console.log(err);
                      //                                  conn.rollback(function () {
                      //                                      console.error('rollback error1');
                      //                                  })
                      //                              }
                      //                              conn.query('SELECT LAST_INSERT_ID() as foodname', function (err, rows) {
                      //                                  if (err) {
                      //                                      /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                      //                                      console.log(err);
                      //                                      conn.rollback(function () {
                      //                                          console.error('rollback error1');
                      //                                      })
                      //                                  } else {
                      //                                      conn.commit(function (err) {
                      //                                          if (err) console.log(err);
                      //                                          console.log("row : " + rows);
                      //                                          var foodname = rows[0].foodname;
                      //                                          //                                  res.redirect('/');
                      //                                      })
                      //                                  }
                      //                              })
                      //                          })
                      //                      })
                      
                      
                      
                      conn.query('insert into recommendfood(foodname,img,subscript) values(?,?,?)', [fdNm, image, ckngMthInfo], function (err, results) {
                          if (err) {
                              console.log(err);
                              res.status(500);
                          } else {
                              //res.redirect('/mypage');
                          }
                      });
                  }

              });
          });


          //          res.send(destinationHTML);






          route.get('/', function (req, res) {
              var sql = 'select foodname,img,subscript from recommendfood';

              conn.query(sql, function (err, rows) {
                  if (err) console.log(err)
                  console.log('rows : ' + rows);
                  res.render('recommend', {
                      user: req.user,
                      rows: rows
                  });
              })

              //              res.render('recommend', {
              //                  user: req.user
              //              });
          });


          //        console.log('call : recommend.js');  
          //        console.log(body);

          return route;
      };
