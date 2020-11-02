/** */
require('dotenv').config();
const axios = require('axios').default;
const appEvent = require('../../events/_config');

const { NOTCH_NOTIFICATION_URI, TWT_BEARER_TOKEN } = process.env;
const { NEW_STREAM_DATA } = require('../../events/constants/stream');

class StreamClient {
    constructor() {
        this.reconnection_delay = 20; // in seconds
    }
    
    calculate_reconnection_delay () {
        this.reconnection_delay *= this.reconnection_delay;
    }

    async pass_event_to_notification_service (event) {
        axios.post(`${NOTCH_NOTIFICATION_URI}/social/event/twitter`, event)
        .then( response => {})
        .catch( e =>  {});
    }

    async listen() {
        try {
            const uri = `https://api.twitter.com/2/tweets/search/stream`;
            const expansions = `author_id`;
            const tweet_fields = `created_at`;
            const user_fields = `profile_image_url`;

            const stream = (await axios.get(`${uri}?tweet.fields=${tweet_fields}&user.fields=${user_fields}&expansions=${expansions}`, {
                responseType: 'stream',
                headers: {
                    Authorization: `Bearer ${TWT_BEARER_TOKEN}`
                }
            })).data;

            console.log('Connected to Twitter Stream.');
            this.reset_reconnection_delay();

            stream.on('data', data => {
                appEvent.emit(NEW_STREAM_DATA, data)
            });
        } catch (e) {
            const { status, statusText } = e.response;
            console.log('reconnecting :', { status, statusText });
            setTimeout(() => this.listen(), (this.reconnection_delay * 1000));
        }
    }

    reset_reconnection_delay() {
        this.reconnection_delay = 20;
    }

}

module.exports = new StreamClient;