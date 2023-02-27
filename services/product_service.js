const Product = require('../models/product_model');
const ProductBrand = require('../models/product_brand_model');
const ProductType = require('../models/product_type_model');
const { default: mongoose } = require('mongoose');

class ProductService {
    static async addProducts(products) {
        for (const product of products) {
            if (await Product.findOne({ name: product.name }).exec()) {
                console.log('Product already exists.');
                continue;
            }
            let productType = await ProductType.findOne({ name: product.type }).exec();
            if (!productType) {
                productType = new ProductType({ name: product.type });
                await productType.save();
            }
            let productBrand = await ProductBrand.findOne({ name: product.brand }).exec();
            if (!productBrand) {
                productBrand = new ProductBrand({ name: product.brand });
                await productBrand.save();
            }

            const newProduct = new Product({
                name: product.name,
                description: product.description,
                brand: productBrand._id,
                type: productType._id
            });

            await newProduct.save();
        }
    }

    static async getProducts(brandIds = [], typeIds = []) {
        let filteredProducts = [];
        if (brandIds.length > 0) {
            filteredProducts = await Product
                .find({ brand: { $in: brandIds } })
                .populate('brand').populate('type').exec();
        }
        else {
            filteredProducts = await Product.find({})
                .populate('brand').populate('type').exec();
        }
        if (typeIds.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                try {
                    const isIn = typeIds.some(id => product.type._id.equals(mongoose.Types.ObjectId(id)));
                    return isIn;
                } catch (error) {
                    return false;
                }

            });
            // console.log(`filteredProducts=${filteredProducts}`);
        }

        return filteredProducts.map(doc => doc.toObject());
    }

    static async getAllBrands() {
        try {
            const brands = await ProductBrand.find({}).exec();
            return brands.map(brand => brand.toObject());
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async getAllTypes() {
        try {
            const types = await ProductType.find({}).exec();
            return types.map(type => type.toObject());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = ProductService;