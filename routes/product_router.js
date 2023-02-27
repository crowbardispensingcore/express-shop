const router = require('express').Router();
const productRestController = require('../controllers/rest/product_controller');

router.post('/', productRestController.addProducts);
router.get('/', productRestController.getProducts);

router.get('/filters', productRestController.getProductFilters);

module.exports = router;