const bcrypt = require('bcrypt');
const User = require('../models/user_model');
const Product = require('../models/product_model');
const ObjectAlreadyExistsException = require('../exceptions/object_already_exists_exception');
const ObjectNotFoundException = require('../exceptions/object_not_found_exception');
const UnauthorizedException = require('../exceptions/unauthorized_exception');

class UserService {
    static async signup(username, email, password) {
        try {
            const existingUser = await User.findOne({
                $or: [
                    { username },
                    { email }
                ]
            }).exec();
            if (existingUser) {
                throw new ObjectAlreadyExistsException();
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });
            await newUser.save();
            return newUser.toObject();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async login(identifier, password) {
        try {
            const user = await User.findOne({
                $or: [
                    { username: identifier },
                    { email: identifier }
                ]
            }).exec();
            if (!user) {
                throw new ObjectNotFoundException();
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async update(userId, username = '', email = '', password = '') {
        try {
            const user = await User.findById(userId).exec();
            if (!user) {
                throw new ObjectNotFoundException();
            }
            if (username !== '') {
                user.username = username;
            }
            if (email !== '') {
                user.email = email;
            }
            if (password !== '') {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }
            await user.save();
            return user.toObject();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getFavoriteProducts(userId) {
        try {
            const user = await User.findById(userId).populate('favoriteProducts').exec();
            if (!user) {
                throw new ObjectNotFoundException();
            }
            return user.favoriteProducts.map(doc => doc.toObject());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async toggleFavoriteProduct(userId, productId) {
        try {
            const user = await User.findById(userId).exec();
            if (!user) {
                throw new ObjectNotFoundException();
            }
            const product = await Product.findById(productId).exec();
            if (!product) {
                throw new ObjectNotFoundException();
            }
            if (user.favoriteProducts.includes(productId)) {
                user.favoriteProducts = user.favoriteProducts.filter(id => !id.equals(productId));
            } else {
                user.favoriteProducts.push(productId);
            }
            await user.save();
            return user.favoriteProducts.map(id => id.toString());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = UserService;