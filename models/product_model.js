const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductBrand',
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true,
    },
});
productSchema.index(
    { brand: 1, type: 1, name: 1 },
    { unique: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;