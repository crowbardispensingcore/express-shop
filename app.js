const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('express-dart-sass');
const hbs = require('hbs');

require('./configs/db');

const indexRouter = require('./routes/index');
const productRouter = require('./routes/product_router');
const userRouter = require('./routes/user_router');
const adminRouter = require('./routes/admin_router');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public', 'stylesheets'),
  dest: path.join(__dirname, 'public', 'stylesheets', 'css'),
  debug: true,
  indentedSyntax: false // true = .sass and false = .scss
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'stylesheets', 'css')));

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

// redirect all undefined routes
app.get('*', (req, res) => {
  res.redirect(`${req.protocol}://${req.get('host')}/user/login`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
