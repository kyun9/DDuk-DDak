var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);


var app = express();
app.use(bodyParser.urlencoded({
    extended: false
})); /*------------post 사용을 위한 bodyParser등록----------*/

app.use(session({ /*------------세션 설정부분----------*/
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '111111',
        database: 'ddukddak'
    })
}));


// view engine setup
app.set('view engine', 'ejs'); /*------------views ejs사용----------*/
app.set('views', path.join(__dirname, 'views')); /*------------path 사용 views경로----------*/
app.use(express.static(path.join(__dirname, 'public'))); /*------------path 사용 public경로----------*/

var passport = require('./routes/config/passport')(app); //passport 맨위로

var index=require('./routes/index');
var ingredient=require('./routes/ingredient')();
var recommend=require('./routes/recommend')();
var auth=require('./routes/auth')(passport);

app.use('/', index);
app.use('/ingredient', ingredient);
app.use('/recommend', recommend);
app.use('/auth', auth);






app.listen(3000, function () {
    console.log("Server running on port 3000");

}); //server 구동 포트 localhost:3000 여기에 쓰입니다.

module.exports = app;
