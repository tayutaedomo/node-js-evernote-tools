'use strict';

const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const expressSession = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const sampleRoutes = require('./routes/sample');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({
  secret: 'supersecretsecret',
  resave: false,
  saveUnititialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.locals.session = req.session || {};
  next();
});


app.get('/sample', sampleRoutes.index);
app.get('/oauth', sampleRoutes.oauth);
app.get('/oauth_callback', sampleRoutes.oauth_callback);
app.get('/clear', sampleRoutes.clear);

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

