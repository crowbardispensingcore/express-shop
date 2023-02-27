const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config('../.env');
const { JWT_SECRET } = process.env;

const homeMvcController = require('../controllers/mvc/home_controller');
const auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    console.log('Token found in request!');
    try {
      jwt.verify(token, JWT_SECRET);
      console.log('User is logged in. Redirecting to home...')
      return res.redirect('/home');
    } catch (error) {
      console.log('Token is invalid/outdated.', error);
    }
  }
  res.render('home', { isLoggedIn: false });
});

router.get('/home', auth.cookieAuth, homeMvcController.home);

module.exports = router;
