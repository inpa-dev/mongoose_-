const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

// DB연결 모듈
const connect = require('./schemas');

// 라우터 모듈
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express();

app.set('port', process.env.PORT || 3002);

// 넌적스 설정
app.set('view engine', 'njk');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// 몽고 디비 연결
connect(); 

app.use(morgan('dev')); // 로그 미들웨어
app.use(express.static(path.join(__dirname, 'public'))); // 기본경로 미들웨어
app.use(express.json()); // post요청 올때 json파싱 미들웨어
app.use(express.urlencoded({ extended: false })); // get요청 올때 url형식 데이터 파싱 미들웨어

// 라우터 연결
app.use('/', indexRouter); // 기본 요청
app.use('/users', usersRouter); // users다큐먼트에 관한 요청
app.use('/comments', commentsRouter); // comments다큐먼트에 관한 요청

// 만일 위 라우터에서 요청이 end되지않으면 실행 -> 라우터 없음
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); // 에러처리 미들웨어로 점프
});

// 에어처리 미들웨어
app.use((err, req, res, next) => {

  // 넌적스 변수 설정
  res.locals.message = err.message; 
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 배포용이 아니라면 객체로그 설정

  res.status(err.status || 500);
  res.render('error'); // error.njk를 띄움
});

// 서버 연결
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});