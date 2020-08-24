/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
require('dotenv').config();
const {
    APP_DB_URI
} = process.env;

const mongoose = require('mongoose');

module.exports.connect = () => {
    mongoose.connect(APP_DB_URI, {
        autoIndex: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err, data) => {
        if (err) {
            console.log(`Could not connect to database`);
            return;
        }

        console.log(`Database connection established.`); 
    });
}
