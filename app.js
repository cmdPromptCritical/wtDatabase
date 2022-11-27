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
var browseRouter = require('./routes/browse');
var resourcesRouter = require('./routes/resources');
var redirectsRouter = require('./routes/redirects');
var handlebars = require('handlebars')
var helpers = require('handlebars-form-helpers').register(handlebars);
var helmet = require('helmet');

var app = express();
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'code.jquery.com', "'unsafe-inline'", 'cdnjs.cloudflare.com','cdn.jsdelivr.net'],
    styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
    fontSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com']
  }
 }));

// view engine setup
var hbs = exphbs.create({
  helpers: {    foo: function() { return 'foo.';}},  //require('./handlers/handlebars'), 
  defaultLayout: 'main', 
  extname: '.hbs'
});

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine)
app.set('view engine', '.hbs');
app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms :res[content-length]'));
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
app.use('/browse', browseRouter);
app.use('/resources', resourcesRouter);
app.use('/to', redirectsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// tells server that it is behind a proxy
app.enable('trust proxy')

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('error occured, code:', err.status)
  res.render('error');
});

module.exports = app;
