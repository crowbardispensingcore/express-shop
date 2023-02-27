exports.home = (req, res) => {
    console.log(`Logged in user ${req.token.userId} visited home page.`)
    res.render('home', { isLoggedIn: true });
}