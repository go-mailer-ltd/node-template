/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const { build_query } = require('../utilities/query');
const { process_failed_response, process_successful_response } = require('../utilities/http-reponse');

class RootService {
    constructor() {}

    async handle_database_read(Controller, query_options, extra_options = {}) {
        const {
            count,
            fields_to_return,
            limit,
            skip,
            seek_conditions,
            sort_condition
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
        if (result && result.id) return process_successful_response(result);
        return process_failed_response(`Resource not found`, 404);
    }

    process_multiple_read_results(result) {
        if (result && (result.count || result.length >= 0)) return process_successful_response(result);
        return process_failed_response(`Resources not found`, 404);
    }

    process_update_result(result) {
        if (result && result.ok && result.nModified) return process_successful_response(result);
        if (result && result.ok && !result.nModified) return process_successful_response(result, 210);
        return process_failed_response(`Update failed`, 200);
    }

    process_delete_result(result) {
        if (result && result.nModified) return process_successful_response(result);
        return process_failed_response(`Deletion failed.`, 200);
    }
}

module.exports = RootService;