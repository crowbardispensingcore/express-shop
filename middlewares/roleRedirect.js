exports.redirectLoggedInUser = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        next();
    }
    return res.redirect('/home');
}