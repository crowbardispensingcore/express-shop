exports.checkAdminRole = (req, res, next) => {
    const redirectUrl = `${req.protocol}://${req.get('host')}/`;
    const adminId = '63ec01cd3b57c4b9eb41541f';
    if (req.token.userId !== adminId) {
        return res.redirect(redirectUrl);
    }
    next();
}