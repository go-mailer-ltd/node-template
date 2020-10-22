/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const appEvent = require('../events/_config');
const { build_query } = require('../utilities/query');

class RootService {
    constructor() {
        this.standard_metadata = {
            is_active: true,
            is_deleted: false,
        }
    }

    create_dummy_request(body = {}, params = {}, query = {}) {
        return { body, params, query };
    }

    delete_record_metadata(record) {
        let record_to_mutate = { ...record };

        //
        delete record_to_mutate.timestamp;
        delete record_to_mutate.created_on;
        delete record_to_mutate.updated_on;
        delete record_to_mutate._v;

        //
        return { ...record_to_mutate };
    }

    async handle_database_read(Controller, query_options, extra_options = {}) {
        const {
            count,
            fields_to_return,
            limit,
            seek_conditions,
            skip,
            sort_condition,
        } = build_query(query_options);

        if (count) {
            return {
                count: (await Controller.read_records({
                    ...seek_conditions,
                    ...extra_options,
                })).length
            }
        } else {
            return await Controller.read_records(
                { ...seek_conditions, ...extra_options },
                fields_to_return,
                sort_condition,
                skip,
                limit
            );
        }
    }

    process_single_read(result, event_name) {
        if (result && result.id) {
            if (event_name) {
                appEvent.emit(event_name, result);
            }
            return this.process_successful_response(result);
        }
        return this.process_failed_response(`Resource not found`, 404);
    }

    process_multiple_read_results(result) {
        if (result && (result.count || result.length >= 0)) return this.process_successful_response(result);
        return this.process_failed_response(`Resources not found`, 404);
    }

    process_update_result(result, event_name) {
        if (result && result.ok && result.nModified) {
            if (event_name) {
                appEvent.emit(event_name, result);
            }
            return this.process_successful_response(result);
        }
        if (result && result.ok && !result.nModified) return this.process_successful_response(result, 210);
        return this.process_failed_response(`Update failed`, 200);
    }

    process_delete_result(result, event_name) {
        if (result && result.nModified) {
            if (event_name) {
                appEvent.emit(event_name, result);
            }
            return this.process_successful_response(result);
        }
        return this.process_failed_response(`Deletion failed.`, 200);
    }

    /** */

    process_failed_response(message, code = 400) {
        return {
            error: message,
            payload: null,
            status_code: code,
            success: false,
        }
    }

    process_successful_response(payload, code = 200) {
        return {
            payload,
            error: null,
            status_code: code,
            success: true,
        }
    }

    /** */
    validate_email(raw_email) {
        const email = raw_email.trim();
        if (email.length < 6) {
            return {
                is_valid: false,
                message: `Email address is too short.`,
            }
        }

        const email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const is_valid = email_pattern.test(email);

        return {
            is_valid,
            message: is_valid ? email : `Invalid email address.`
        }
    }
}

module.exports = RootService;