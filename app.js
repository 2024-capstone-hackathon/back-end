const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 라우터 파일 추가
const ecoRouter = require('./routes/counsels/eco');
const letterRouter = require('./routes/stories/letter');
const likeRouter = require('./routes/stories/like');
const selectedRouter = require('./routes/stories/selected');
const questionAnswerRouter = require('./routes/question/question_answer');
const questionSupervisorRouter = require('./routes/question/question_supervisor');

const app = express();

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 미들웨어 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 설정
app.use('/eco', ecoRouter); // eco 라우터
app.use('/letter', letterRouter); // letter 라우터
app.use('/like', likeRouter); // like 라우터
app.use('/selected', selectedRouter); // selected 라우터
app.use('/question_answer', questionAnswerRouter); // question_answer 라우터
app.use('/question_supervisor', questionSupervisorRouter); // question_supervisor 라우터

// 404 에러 처리
app.use(function (req, res, next) {
  next(createError(404));
});

// 에러 핸들러
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 에러 페이지 렌더링
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
