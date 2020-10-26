/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
require('dotenv').config();
const crypto = require('crypto');
const Twit = require('twitter-lite');
const RootService = require('../_root');
const appEvent = require('../../events/_config');

const {
    NOTCH_COMMS_URI,
    TWT_ACCESS_TOKEN,
    TWT_ACCESS_TOKEN_SECRET,
    TWT_CONSUMER_KEY,
    TWT_CONSUMER_SECRET,
    TWT_SANDBOX,
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

    async handle_incoming_event(request, next) {
        try {
            appEvent.emit('twitter_event', request.body);
            return this.process_successful_response({}, 200, true);
        } catch (e) {
            e = e.errors ? e.errors[0] : e;
            const err = this.process_failed_response(`[WebhookService] handle_incoming_event: ${e.message}`, 500);
            next(err);
        }
    }

    async ping_webhook(request, next) {
        try {
            const { webhook_id } = request.params;
            const ping_uri = `account_activity/all/${TWT_SANDBOX}/webhooks/${webhook_id}`;
            const ping_response = await this.twitter_client.put(ping_uri);
            return this.process_successful_response(ping_response);
        } catch (e) {
            e = e.errors ? e.errors[0] : e;
            const err = this.process_failed_response(`[WebhookService] ping_webhook: ${e.message}`, 500);
            next(err);
        }
    }

    async register_webhook(request, next) {
        try {
            const webhook_uri = `${NOTCH_COMMS_URI}/twitter/webhook`;
            const registration_uri = `account_activity/all/${TWT_SANDBOX}/webhooks`;
            const registration_response = await this.twitter_client.post(`${registration_uri}`, {url: webhook_uri});
            return this.process_successful_response(registration_response);
        } catch (e) {
            e = e.errors ? e.errors[0] : e;
            const err = this.process_failed_response(`[WebhookService] register_webhook: ${e.message}`, 500);
            next(err);
        }
    }

    async retrieve_webhook(request, next) {
        try {
            const retreival_uri = `account_activity/all/${TWT_SANDBOX}/webhooks`;
            const retreival_response = await this.twitter_client.get(retreival_uri);
            return this.process_successful_response(retreival_response);
        } catch (e) {
            e = e.errors ? e.errors[0] : e;
            const err = this.process_failed_response(`[WebhookService] retreive_webhook: ${e.message}`, 500);
            next(err);
        }
    }

    async verify_crc(request, next) {
        try {
            const { crc_token } = request.query;
            const crc_hmac = crypto.createHmac('sha256', TWT_CONSUMER_SECRET);
            const crc_hmac_update = crc_hmac.update(crc_token);
            const response_token = crc_hmac_update.digest('base64');
            return this.process_successful_response({
                response_token: `sha256=${response_token}`
            }, 200, true);
        } catch (e) {
            e = e.errors ? e.errors[0] : e;
            const err = this.process_failed_response(`[WebhookService] verify_crc: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = new WebhookService();