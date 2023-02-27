const router = require('express').Router();
const userRestController = require('../controllers/rest/user_controller');
const accountMvcController = require('../controllers/mvc/account_controller');
const auth = require('../middlewares/auth');

router.post('/signup', userRestController.signup);
router.get('/signup', accountMvcController.signup);

router.post('/login', userRestController.login);
router.get('/login', accountMvcController.login);

router.post('/logout', userRestController.logout);

router.patch('/favorites', auth.cookieAuth, userRestController.toggleFavorite);
router.get('/favorites', auth.cookieAuth, userRestController.getFavorites);

module.exports = router;