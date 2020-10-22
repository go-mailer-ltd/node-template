/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
require('dotenv').config();
const Twit = require('twitter-lite');
const RootService = require('../_root');
const UserController = require('../../controllers/user');

const { format_data_for_database, split_query_params } = require('./helper');

const {
    build_query,
    build_wildcard_options
} = require('../../utilities/query');
const { token } = require('morgan');

const {
    TWT_ACCESS_TOKEN,
    TWT_ACCESS_TOKEN_SECRET,
    TWT_CALLBACK,
    TWT_CONSUMER_KEY,
    TWT_CONSUMER_SECRET,
} = process.env;

class UserService extends RootService {
    constructor(
        user_controller
    ) {
        /** */
        super();
        this.twitter_client = new Twit({
            access_token_key: TWT_ACCESS_TOKEN,
            access_token_secret: TWT_ACCESS_TOKEN_SECRET,
            consumer_key: TWT_CONSUMER_KEY,
            consumer_secret: TWT_CONSUMER_SECRET,
        });

        /** */
        this.user_controller = user_controller;
    }

    async create_record(data) {
        try {
            let data_to_save = format_data_for_database(data);
            const record = await this.user_controller.read_records({ org_id });
            if (record && record.id) {
                const record_update = await this.user_controller.update_records({ org_id }, { ...data_to_save, is_active: true, });
                return this.process_update_result({ ...record_update, data_to_save, is_active: true, }, 'twitter_account_connected.');
            }

            const result = await this.user_controller.create_record({ ...data_to_save });
            return this.process_single_read(result, 'twitter_account_connected.');
        } catch (e) {
            const err = this.process_failed_response(`[UserService] created_record: ${e.message}`, 500);
            next(err);
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
            const err = this.process_failed_response(`[UserService] obtain_request_token ${e.message}`, 500);
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



    async read_record_by_id(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.user_controller.read_records({ id, ...this.standard_metadata });
            return this.process_single_read(result[0]);
        } catch (e) {
            const err = this.process_failed_response(`[UserService] update_record_by_id: ${e.message}`, 500);
            return next(err);
        }
    }

    async read_records_by_filter(request, next) {
        try {
            const { query } = request;

            const result = await this.handle_database_read(this.user_controller, query, { ...this.standard_metadata });
            return this.process_multiple_read_results(result);
        } catch (e) {
            const err = this.process_failed_response(`[UserService] read_records_by_filter: ${e.message}`, 500);
            next(err);
        }
    }

    async read_records_by_wildcard(request, next) {
        try {
            const { params, query } = request;

            if (!params.keys || !params.keys) {
                return next(this.process_failed_response(`Invalid key/keyword`, 400));
            }

            const wildcard_conditions = build_wildcard_options(params.keys, params.keyword);
            const result = await this.handle_database_read(this.user_controller, query, {
                ...wildcard_conditions,
                ...this.standard_metadata,
            });
            return this.process_multiple_read_results(result);
        } catch (e) {
            const err = this.process_failed_response(`[UserService] read_records_by_wildcard: ${e.message}`, 500);
            next(err);
        }
    }

    async update_record_by_id(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.user_controller.update_records({ id }, { ...data });
            return this.process_update_result({ ...result, id });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] update_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async update_records(request, next) {
        try {
            const { options, data } = request.body;
            const { seek_conditions } = build_query(options);

            const result = await this.user_controller.update_records({ ...seek_conditions }, { ...data });
            return this.process_update_result({ ...data, ...result, options: seek_conditions });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] update_records: ${e.message}`, 500);
            next(err);
        }
    }

    async delete_record_by_id(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.user_controller.delete_records({ id });
            return this.process_delete_result({ ...result, id });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async delete_records(request, next) {
        try {
            const { options } = request.body;
            const { seek_conditions } = build_query(options);

            const result = await this.user_controller.delete_records({ ...seek_conditions });
            return this.process_delete_result({ ...result, options: seek_conditions });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] delete_records: ${e.message}`, 500);
            next(err);
        }
    }

    /** */
    async loadTwitterUsers() {
        const users = await this.user_controller.read_records({});

        if (users.success) {
            for (let i in users.payload) {
                const user = users.payload[i];
                if (user.service !== this.serviceName) continue;
                const tweep = new Tweep(user);
                this.addUserToServerObject(tweep)
            }
        }

    }
}

module.exports = new UserService(UserController);