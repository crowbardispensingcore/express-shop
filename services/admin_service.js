const User = require('../models/user_model');

class AdminService {
    static async getUsers() {
        try {
            const users = await User.find({})
                .populate('favoriteProducts').exec();
            return users.map(doc => doc.toObject());
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = AdminService;