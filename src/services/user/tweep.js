/** */
require('dotenv').config();
const axios = require('axios').default;
const RootService = require('../_root');

const { NOTCH_CHAT_URI, TWT_SANDBOX } = process.env;
const { logger } = require('../../utilities/logger');
const { get_tweep_client } = require('../_twitter-client');
const { process_direct_message } = require('../_event-processor');

class Tweep extends RootService {
    constructor(user_data) {
        super();

        this.twitter_client = get_tweep_client(user_data);
        this.user_data = user_data;
    }

    async create_subscription() {
        try {
            await this.twitter_client.post(`account_activity/all/${TWT_SANDBOX}/subscriptions`);
            console.log(`${this.user_data.username} subscription created.`);
        } catch (e) {
            e = e.errors ? e.errors[0] : e;
            logger.error(`[Tweep Error] create_subscription - ${e.message}`);
        }
    }

    async delete_subscription() {
        try {
            await this.twitter_client.delete(`account_activity/all/${TWT_SANDBOX}/subscriptions/${this.user_data.tweep_id}`)
            console.log(`${this.user_data.username} subscription deleted.`);
        } catch (e) {
            logger.error(`[Tweep Error] delete_subscription - ${e.message}`);
        }
    }

    async pass_to_ticket_service(event_data) {
        try {
            const dm_data = process_direct_message({ ...event_data, ...this.user_data });
            await axios.post(`${NOTCH_CHAT_URI}`, dm_data);
        } catch (e) {
            logger.error(`[Tweep Error] pass_to_ticket_service - ${e.message}`);
        }
    }

    async reply_comment(data) {
        try {
            await this.twitter_client.post(`statuses/update`, { ...data });
            return this.process_successful_response(data);
        } catch (e) {
            logger.error(`[Tweep Error] delete_subscription - ${e.message}`);
            return this.process_failed_response(`Reply failed.`);
        }
    }

    async reply_direct_message(data) {
        try {
            await this.twitter_client.post(`direct_messages/events/new`, { ...data });
            return this.process_successful_response(data);
        } catch (e) {
            logger.error(`[Tweep Error] delete_subscription - ${e.message}`);
            return this.process_failed_response(`Reply failed.`);
        }
    }
}

module.exports = Tweep;