/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
const RootService = require('../_root');
const StreamController = require('../../controllers/stream');
const StreamSchema = require('../../schemas/stream');

const {
    build_query,
    build_wildcard_options
} = require('../../utilities/query');

class StreamService extends RootService {
    constructor(
        stream_controller
    ) {
        /** */
        super();

        /** */
        this.stream_controller = stream_controller;
    }

    async create_record(request, next) {
        try {
            const { body } = request;
            const { error } = StreamSchema.validate(body);

            if (error) throw new Error(error);

            delete body.id;
            const result = await this.stream_controller.create_record({ ...body });
            return this.process_single_read(result);
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] created_record: ${e.message}`, 500);
            next(err);
        }
    }

    async read_record_by_id(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.stream_controller.read_records({ id, ...this.standard_metadata });
            return this.process_single_read(result[0]);
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] update_record_by_id: ${e.message}`, 500);
            return next(err);
        }
    }

    async read_records_by_filter(request, next) {
        try {
            const { query } = request;

            const result = await this.handle_database_read(this.stream_controller, query, { ...this.standard_metadata });
            return this.process_multiple_read_results(result);
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] read_records_by_filter: ${e.message}`, 500);
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
            const result = await this.handle_database_read(this.stream_controller, query, {
                ...wildcard_conditions,
                ...this.standard_metadata,
            });
            return this.process_multiple_read_results(result);
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] read_records_by_wildcard: ${e.message}`, 500);
            next(err);
        }
    }

    async update_record_by_id(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.stream_controller.update_records({ id }, { ...data });
            return this.process_update_result({ ...result, id });
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] update_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async update_records(request, next) {
        try {
            const { options, data } = request.body;
            const { seek_conditions } = build_query(options);

            const result = await this.stream_controller.update_records({ ...seek_conditions }, { ...data });
            return this.process_update_result({ ...data, ...result, options: seek_conditions });
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] update_records: ${e.message}`, 500);
            next(err);
        }
    }

    async delete_record_by_id(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.stream_controller.delete_records({ id });
            return this.process_delete_result({ ...result, id });
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async delete_records(request, next) {
        try {
            const { options } = request.body;
            const { seek_conditions } = build_query(options);

            const result = await this.stream_controller.delete_records({ ...seek_conditions });
            return this.process_delete_result({ ...result, options: seek_conditions });
        } catch (e) {
            const err = this.process_failed_response(`[StreamService] delete_records: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = new StreamService(StreamController);