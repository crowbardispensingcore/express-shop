const AdminService = require('../../services/admin_service')

exports.adminHome = async (req, res) => {
    try {
        const users = await AdminService.getUsers();
        res.render('admin_home', { users: users, isLoggedIn: true });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}