require('dotenv').config('../.env');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

exports.headerAuth = (req, res, next) => {
    // console.log("Request headers are: ", req.headers);
    const bearerHeader = req.headers['Authorization'];
    const redirectUrl = `${req.protocol}://${req.get('host')}/`;
    if (!bearerHeader) {
        console.log('Auth header does not exist.');
        return res.redirect(redirectUrl);
    }
    const token = bearerHeader.split(' ')[1];
    if (!token) {
        console.log('Token does not exist in header.');
        return res.redirect(redirectUrl);
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.token = decoded;
        console.log("Token validated.");
        next();
    }
    catch (error) {
        console.log('Token validation failed.');
        return res.redirect(redirectUrl);
        // return res.status(401).json({ message: 'Unauthorized' });
    }
}

exports.cookieAuth = (req, res, next) => {
    // console.log('Request cookies are: ', req.cookies);
    const token = req.cookies.token;
    const redirectUrl = `${req.protocol}://${req.get('host')}/`;
    if (!token) {
        console.log('Token does not exist in cookies.')
        return res.redirect(redirectUrl);
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.token = decoded;
        console.log("Token validated.")
        next();
    }
    catch (error) {
        console.log('Token validation failed.', error);
        return res.redirect(redirectUrl);
        // return res.status(401).json({ message: 'Unauthorized' });
    }
}