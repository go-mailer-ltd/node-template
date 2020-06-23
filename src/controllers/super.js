/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
const mongoose = require('mongoose');

/** require all models here */
require('../models/sample');


/** */
class SuperController {
    constructor () {}
    
    get_model(model_name) {
        return mongoose.model(model_name);
    }

    jsonize(data) {
        return JSON.parse(JSON.stringify(data))
    }
}

module.exports = SuperController;