/**
 * This file automatically loads up all event files on start up.
**/

let glob = require('glob');
let { resolve } = require('path');

module.exports.loadEventSystem = () => {
    let basePath = resolve(__dirname, '.');
    let files = glob.sync('*.js', { cwd: basePath })
    files.forEach(file => {
        if ((file.toLocaleLowerCase()).includes('_config')) return;
        require(resolve(basePath, file));
    });
};