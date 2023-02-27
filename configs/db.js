require('dotenv').config('../.env');
const mongoose = require('mongoose');

const { MONGO_HOST_URL } = process.env;

(async () => {
    try {
        await mongoose.connect(MONGO_HOST_URL);
        console.log('Connection to MongoDB established.');
    }
    catch (error) {
        console.error(error);
        throw error;
    }
})();

module.exports = mongoose.connection;