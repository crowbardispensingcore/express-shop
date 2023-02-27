const mongoose = require('mongoose');

const productBrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const ProductBrand = mongoose.model('ProductBrand', productBrandSchema);

module.exports = ProductBrand;