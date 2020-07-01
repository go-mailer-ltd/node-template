/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const { build_query } = require('../utilities/query');

class RootService {
    constructor() { }

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

    process_single_read(result) {
        if (result && result.id) return this.process_successful_response(result);
        return this.process_failed_response(`Resource not found`, 404);
    }

    process_multiple_read_results(result) {
        if (result && (result.count || result.length >= 0)) return this.process_successful_response(result);
        return this.process_failed_response(`Resources not found`, 404);
    }

    process_update_result(result) {
        if (result && result.ok && result.nModified) return this.process_successful_response(result);
        if (result && result.ok && !result.nModified) return this.process_successful_response(result, 210);
        return this.process_failed_response(`Update failed`, 200);
    }

    process_delete_result(result) {
        if (result && result.nModified) return this.process_successful_response(result);
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
}

module.exports = RootService;