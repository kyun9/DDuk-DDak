var express = require('express'); // ExpressJS 모듈을 추가
var path = require('path');
var swig = require('swig');

var app = express();




// view engine setup
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('.html', swig.renderFile);

app.set('view cache', false);
swig.setDefaults({ cache: false });

app.get('/', function (req, res) { // 웹에서 실행할 주소가 localhost:3000/ 이거일때를 선언

    res.render('index'); // index.ejs로 써도 되고 index만 써도 파일 실행을 해줍니다.

});



app.listen(8282); //server 구동 포트 localhost:3000 여기에 쓰입니다.


console.log("Server running on port 8282");
