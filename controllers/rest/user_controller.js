const UserService = require('../../services/user_service');
const jwt = require('jsonwebtoken');
const ObjectAlreadyExistsException = require('../../exceptions/object_already_exists_exception');
const ObjectNotFoundException = require('../../exceptions/object_not_found_exception');
const UnauthorizedException = require('../../exceptions/unauthorized_exception');
const Joi = require('joi');

const { JWT_SECRET } = process.env;

exports.signup = async (req, res) => {
    const reqSchema = Joi.object({
        username: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required()
    });
    const { error } = reqSchema.validate(req.body);
    if (error) {
        console.error(error);
        return res.status(400).send(error);
    }

    try {
        const { username, email, password } = req.body;
        const newUser = await UserService.signup(username, email, password);
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('token', token, { httpOnly: true });
        return res.json({
            userId: newUser._id,
            redirectPath: '/home'
        });
    } catch (error) {
        console.error(error);
        if (error instanceof ObjectAlreadyExistsException) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        return res.sendStatus(500);
    }
}

exports.login = async (req, res) => {
    const reqSchema = Joi.object({
        identifier: Joi.string().min(1).required(),
        password: Joi.string().min(1).required()
    });
    const { error } = reqSchema.validate(req.body);
    if (error) {
        console.error(error);
        return res.status(400).send(error);
    }

    try {
        const { identifier, password } = req.body;
        const user = await UserService.login(identifier, password);
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('token', token, { httpOnly: true });
        return res.json({
            userId: user._id,
            redirectPath: '/home'
        });
    } catch (error) {
        console.error(error);
        if (error instanceof ObjectNotFoundException || error instanceof UnauthorizedException) {
            return res.status(401).json({ message: 'Incorrect login credential.' });
        }
        return res.sendStatus(500);
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.sendStatus(200);
}

exports.toggleFavorite = async (req, res) => {
    const reqSchema = Joi.object({
        productId: Joi.string().required()
    });
    const { error } = reqSchema.validate(req.body);
    if (error) {
        console.error(error);
        return res.status(400).send(error);
    }

    // req.token = { userId: '63e927ea8f77d0c1fde8e39b' };
    try {
        const { productId } = req.body;
        const userId = req.token.userId;
        console.log(`userId=${userId}`);
        const favorites = await UserService.toggleFavoriteProduct(userId, productId);

        return res.json(favorites);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

exports.getFavorites = async (req, res) => {
    const userId = req.token.userId;
    try {
        const favorites = await UserService.getFavoriteProducts(userId);
        console.log(`userId=${userId} favorites=${favorites}`);
        return res.json({ 'favorites': favorites });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}