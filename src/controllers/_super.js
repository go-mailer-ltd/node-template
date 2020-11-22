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
    
    delete_record_metadata (record) {
        let record_to_mutate = { ...record };

        //
        delete record_to_mutate.timestamp;
        delete record_to_mutate.created_on;
        delete record_to_mutate.updated_on;
        delete record_to_mutate._v;

        //
        return { ...record_to_mutate };
    }

    get_model(model_name) {
        return mongoose.model(model_name);
    }

    jsonize(data) {
        return JSON.parse(JSON.stringify(data))
    }

    async get_record_metadata (model, _id, time_stamp) {
<<<<<<< HEAD
        const n = (await model.estimatedDocumentCount({ time_stamp: { $lt: time_stamp } })) + 1;
=======
        const n = (await model.countDocuments({ time_stamp: { $lt: time_stamp } })) + 1;
>>>>>>> 85c5c88325d721956af4bf751a9d973d11968f7b
        await model.updateOne({ _id }, { id: n });
        return n;
    }
}

module.exports = SuperController;