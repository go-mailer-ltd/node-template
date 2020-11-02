/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
const mongoose = require('mongoose');
const glob = require('glob');
const { resolve } = require('path');


/** require all models here */
const basePath = resolve(__dirname, '../models/');
const files = glob.sync('*.js', { cwd: basePath })
files.forEach(file => {
    if ((file.toLocaleLowerCase()).includes('_config')) return;
    require(resolve(basePath, file));
});


/** */
class SuperController {
    constructor () {}
    
    get_model(model_name) {
        return mongoose.model(model_name);
    }

    jsonize(data) {
        return JSON.parse(JSON.stringify(data))
    }

    async get_record_metadata (model, _id, time_stamp) {
        const n = (await model.countDocuments({ time_stamp: { $lt: time_stamp } })) + 1;
        await model.updateOne({ _id }, { id: n });
        return n;
    }
}

module.exports = SuperController;