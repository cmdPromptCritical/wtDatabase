var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var searchRouter = require('./routes/search');
var libRouter = require('./routes/lib');
var handlebars = require('handlebars')
var helpers = require('handlebars-form-helpers').register(handlebars);
var app = express();

// view engine setup
var hbs = exphbs.create({
  helpers: {    foo: function() { return 'foo.';}},  //require('./handlers/handlebars'), 
  defaultLayout: 'main', 
  extname: '.hbs'
});
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine)
app.set('view engine', '.hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/search', searchRouter);
app.use('/lib', libRouter);

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
  console.log('error occured, code:', err.status)
  res.render('error');
});

module.exports = app;
