const AdminService = require('../../services/admin_service');

exports.getUsers = async (req, res) => {
    try {
        const users = await AdminService.getUsers();
        return res.json({
            'users': users
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}