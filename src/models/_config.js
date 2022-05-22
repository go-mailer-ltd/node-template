/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
let glob = require('glob');
let { resolve } = require('path');

const {
    app_db_uri
} = require('../../config')

let mongoose = require('mongoose');

module.exports.connect = () => {
    try {

        mongoose.connect(app_db_uri, {
            autoIndex: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err, __) => {
            if (err) {
                console.log(`Could not connect to database`);
                return;
            }

            console.log(`Database connection established.`);
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
    }
}

module.exports.loadModels = () => {
    let basePath = resolve(__dirname, '../models/');
    let files = glob.sync('*.js', { cwd: basePath });
    files.forEach(file => {
        if ((file.toLocaleLowerCase()).includes('_config')) return;
        require(resolve(basePath, file));
    });
}