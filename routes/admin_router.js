const router = require('express').Router();

const adminRestController = require('../controllers/rest/admin_controller');
const adminMvcController = require('../controllers/mvc/admin_controller');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/admin_auth');

router.get('/home',
    auth.cookieAuth,
    adminAuth.checkAdminRole,
    adminMvcController.adminHome
);

router.get('/users',
    auth.cookieAuth,
    adminAuth.checkAdminRole,
    adminRestController.getUsers
);

module.exports = router;