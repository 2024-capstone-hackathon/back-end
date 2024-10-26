const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 라우터 파일 추가
var indexRouter = require('./routes/index');
var letterRouter = require('./routes/letter');
var likeRouter = require('./routes/like');
var selectedRouter = require('./routes/selected');
var ecoRouter = require('./routes/eco');
var questionSupervisorRouter = require('./routes/question_supervisor');
//var questionAnswerRouter = require('./routes/question_answer');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 설정
app.use('/', indexRouter);
app.use('/letter', letterRouter);
app.use('/like', likeRouter);
app.use('/selected', selectedRouter);
app.use('/eco', ecoRouter);
app.use('/question_supervisor', questionSupervisorRouter);
//app.use('/question_answer', questionAnswerRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
