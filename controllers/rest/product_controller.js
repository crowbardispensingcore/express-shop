const Joi = require('joi');
const ProductService = require('../../services/product_service');

const ITEMS_PER_PAGE = 10;

const paginate = (array, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return array.slice(startIndex, endIndex);
}

exports.addProducts = async (req, res) => {
    const productSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        brand: Joi.string().required(),
        type: Joi.string().required()
    });
    const reqSchema = Joi.object({
        products: Joi.array().items(productSchema)
    });
    const { error } = reqSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error);
    }

    try {
        const { products } = req.body;
        await ProductService.addProducts(products);

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

exports.getProducts = async (req, res) => {
    const querySchema = Joi.object({
        page: Joi.number().integer().optional(),
        brand: Joi.string().optional(),
        type: Joi.string().optional()
    });
    const { error } = querySchema.validate(req.query);
    if (error) {
        return res.status(400).send(error);
    }

    try {
        let page = parseInt(req.query.page) || 1;
        const brandIds = req.query.brand ? req.query.brand.split(';') : [];
        const typeIds = req.query.type ? req.query.type.split(';') : [];
        // console.log(`page=${page}, brandIds=${brandIds}, typeIds=${typeIds}`);

        const products = await ProductService.getProducts(brandIds, typeIds);
        // console.log(`products=${products}`);
        const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);
        page = page > pageCount ? pageCount : page;
        page = page < 1 ? 1 : page;

        const paginatedProducts = paginate(products, page);

        return res.json({
            'products': paginatedProducts,
            'pageCount': pageCount,
            'currentPage': page
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

exports.getProductFilters = async (req, res) => {
    try {
        const brands = await ProductService.getAllBrands();
        const types = await ProductService.getAllTypes();
        return res.json({ brands, types });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}