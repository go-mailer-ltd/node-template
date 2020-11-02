/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
require('dotenv').config();
const Tweep = require('./tweep');
const RootService = require('../_root');
const appEvent = require('../../events/_config');
const UserController = require('../../controllers/user');

const { TwitterClient, } = require('../_twitter-client');
const { TWT_CALLBACK, } = process.env;
const { TWT_ACCT_CONNECTED } = require('../../events/constants/user');
const { ACCOUNT_ACTIVITY_EVENT, } = require('../../events/constants/user');
const { format_data_for_database, split_query_params } = require('./helper');
const { response } = require('express');


class UserService extends RootService {
    constructor(
        twitter_client,
        user_controller,
    ) {
        /** */
        super();
        this.tweeps = new Map();
        this.twitter_client = twitter_client;
        this.user_controller = user_controller;

        /** */
        this.load_users();
        appEvent.on(ACCOUNT_ACTIVITY_EVENT, data => this.handle_incoming_event(data));
    }

    async add_tweep(user_data, should_create_subscription = false) {
        const { tweep_id } = user_data;
        const tweep = new Tweep(user_data);
        this.tweeps.set(tweep_id, tweep);

        if (should_create_subscription) {
            tweep.create_subscription();
        }
    }

    async create_record(data) {
        const { org_id } = data;
        let data_to_save = format_data_for_database(data);
        const record = await this.user_controller.read_records({ org_id });
        if (record[0] && record[0].id) {
            const record_update = await this.user_controller.update_records({ org_id }, { ...data_to_save });
            this.add_tweep({ ...record[0], ...data_to_save }, true);
            return this.process_update_result({ ...record_update, ...data_to_save }, TWT_ACCT_CONNECTED);
        }

        const result = await this.user_controller.create_record({ ...data_to_save });
        this.add_tweep(result, true);
        return this.process_single_read(result, TWT_ACCT_CONNECTED);
    }

    async handle_incoming_event(data) {
        const recipient = data.for_user_id;

        if (data.direct_message_events) {
            const tweep = this.tweeps.get(recipient);
            tweep.pass_to_ticket_service(data);
        }
    }

    async obtain_access_token(request, next) {
        try {
            const { oauth_query_string, org_id } = request.body;

            if (oauth_query_string === undefined || oauth_query_string.length < 1) {
                return this.process_failed_response(`Invalid oauth_query_string`)
            }

            const query_params = split_query_params(oauth_query_string);
            const tokens = await this.twitter_client.getAccessToken(query_params);

            if (!tokens || !tokens.oauth_token) return this.process_failed_response(`Could not connect account.`);
            return await this.create_record({ ...tokens, org_id });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] obtain_access_token ${e.message}`, 500);
            next(err);
        }
    }

    async obtain_request_token(request, next) {
        try {
            const tokens = await this.twitter_client.getRequestToken(TWT_CALLBACK);
            return this.process_successful_response(tokens);
        } catch (e) {
            const err = this.process_failed_response(`[UserService] obtain_request_token ${e.message}`, 500);
            next(err);
        }
    }

    async read_organisation_record(request, next) {
        try {
            const { org_id } = request.params;
            if (!org_id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.user_controller.read_records({ org_id: Number(org_id), ...this.standard_metadata });
            return this.process_single_read(result[0]);
        } catch (e) {
            const err = this.process_failed_response(`[UserService] read_organisation_record: ${e.message}`, 500);
            return next(err);
        }
    }

    async delete_organisation_record(request, next) {
        try {
            const { org_id } = request.params;
            if (!org_id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.user_controller.delete_records({ org_id });
            return this.process_delete_result({ ...result, org_id });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    /** */
    async load_users() {
        const users = await this.user_controller.read_records({});

        users.forEach(user => {
            this.add_tweep(user);
        });
    }

    /** */
    async respond_to_activity(request, activity_type = 'comment', next) {
        try {
            const { user_id } = request.body;
            const tweep = this.tweeps.get(user_id);

            switch(activity_type) {
                case 'comment':
                    return await tweep.reply_comment(request.body);
                case 'dm':
                    return await tweep.reply_direct_message(request.body);
                default:
            }
        } catch (e) {
            const err = this.process_failed_response(`[UserService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = new UserService(TwitterClient, UserController);