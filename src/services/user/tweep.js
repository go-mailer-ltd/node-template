/** */
const { get_tweep_client } = require('../_twitter-client');

class Tweep {
    constructor (user_data) {
        this.twitter_client = get_tweep_client(user_data);
        this.user_data = user_data;
    }
}

module.exports = Tweep;