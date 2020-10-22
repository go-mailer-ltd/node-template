/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
require('dotenv').config();
const crypto = require('crypto');
const Twit = require('twitter-lite');
const RootService = require('../_root');

const {
    NOTCH_COMMS_URI,
    TWT_ACCESS_TOKEN,
    TWT_ACCESS_TOKEN_SECRET,
    TWT_CALLBACK,
    TWT_CONSUMER_KEY,
    TWT_CONSUMER_SECRET,
    TWT_SANDBOX,
    TWT_URI,
} = process.env;

class WebhookService extends RootService {
    constructor() {
        /** */
        super();

        this.twitter_client = new Twit({
            access_token_key: TWT_ACCESS_TOKEN,
            access_token_secret: TWT_ACCESS_TOKEN_SECRET,
            consumer_key: TWT_CONSUMER_KEY,
            consumer_secret: TWT_CONSUMER_SECRET,
        });
    }

    async ping_webhook(webhook_id) {
        try {
            const ping_uri = `${TWT_URI}/account_activity/all/${TWT_SANDBOX}/webhooks/${webhook_id}`;
            const ping_response = await this.twitter_client.put(ping_uri);
            return this.process_successful_response(ping_response);
        } catch (e) {
            const err = this.process_failed_response(`[WebhookService] ping_webhook: ${e.message}`, 500);
            next(err);
        }
    }

    async register_webhook() {
        try {
            const registration_uri = `${TWT_URI}/account_activity/all/${TWT_SANDBOX}/webhooks`;
            const registration_response = await this.twitter_client.post(registration_uri);
            return this.process_successful_response(registration_response);
        } catch (e) {
            const err = this.process_failed_response(`[WebhookService] register_webhook: ${e.message}`, 500);
            next(err);
        }
    }

    async retrieve_webhook() {
        try {
            const retreival_uri = `${TWT_URI}/account_activity/all/${TWT_SANDBOX}/webhooks`;
            const retreival_response = await this.twitter_client.get(retreival_uri);
            return this.process_successful_response(retreival_response);
        } catch (e) {
            const err = this.process_failed_response(`[WebhookService] retreive_webhook: ${e.message}`, 500);
            next(err);
        }
    }

    async verify_crc(crc) {
        const crc_hmac = crypto.createHmac('sha256', TWT_CONSUMER_SECRET);
        const crc_hmac_update = crc_hmac.update(crc);
        const response_token = crc_hmac_update.digest('base64');
        return {
            response_token: `sha256=${response_token}`
        }
    }
}

module.exports = new WebhookService();