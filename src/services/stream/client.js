/** */
require('dotenv').config();
const axios = require('axios').default;
const { TWT_BEARER_TOKEN } = process.env;
const appEvent = require('../../events/_config');
const { NEW_STREAM_DATA } = require('../../events/constants/stream');

class StreamClient {
    constructor () {}

    async listen() {
        const stream = (await axios.get(`https://api.twitter.com/2/tweets/search/stream`, {
            responseType: 'stream',
            headers: {
                Authorization: `Bearer ${TWT_BEARER_TOKEN}`
            }
        })).data;
        
        stream.on('data', data => appEvent.emit(NEW_STREAM_DATA, data));
        
        stream.on('error', e => {
            console.log(e);
        });
    }
}

module.exports = new StreamClient;