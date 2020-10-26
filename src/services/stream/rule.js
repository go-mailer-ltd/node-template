/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
const RootService = require('../_root');
const StreamSchema = require('../../schemas/stream');
const { STREAM_RULE_UPDATE } = require('../../events/constants/stream');
const StreamController = require('../../controllers/stream');

const {
} = require('../../utilities/query');

class StreamRuleService extends RootService {
    constructor(
        stream_controller
    ) {
        /** */
        super();

        /** */
        this.stream_controller = stream_controller;
    }

    async add_rule(request, next) {
        try {
            const { body } = request;
            const { org_id } = body;

            const { error } = StreamSchema.validate(body,{ allowUnknown: true });
            if (error) throw new Error(error);

            let operation;
            const record = await this.stream_controller.read_records({ org_id, });
            if (record[0] && record[0].id) {
                const update_data = this.delete_record_metadata(body);
                operation = await this.stream_controller.update_records({ org_id, }, { ...update_data, is_active: true });
                return this.process_update_result({ ...operation, ...body, ...record[0], is_active: true }, STREAM_RULE_UPDATE);
            } else {
                operation = await this.stream_controller.create_record({ ...body });
                return this.process_single_read(operation, STREAM_RULE_UPDATE);
            }
        } catch (e) {
            const err = this.process_failed_response(`[StreamRuleService] add_rule: ${e.message}`, 500);
            next(err);
        }
    }

    async read_rules(request, next) {
        try {
            const { org_id } = request.params;
            if (!org_id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.stream_controller.read_records({ org_id, ...this.standard_metadata });
            return this.process_single_read(result[0]);
        } catch (e) {
            const err = this.process_failed_response(`[StreamRuleService] read_rules: ${e.message}`, 500);
            return next(err);
        }
    }

}

module.exports = new StreamRuleService(StreamController);