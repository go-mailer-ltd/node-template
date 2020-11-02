/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
const SuperController = require('./_super');

class UserController extends SuperController {
    constructor() {
        super();

        /** */
        this.model = this.get_model('User');
    }

    async create_record(data) {
        try {
            const record_to_create = new this.model({ ...data });
            const created_record = await record_to_create.save();

            return {
                ...this.jsonize(created_record),
                id: await this.get_record_metadata(this.model, created_record._id, created_record.time_stamp),
            };
        } catch (e) {
            console.log(`[UserController] create_record Error: ${e.message}`);
        }
    }

    async read_records(conditions, fields_to_return = '', sort_options = '', skip = 0, limit = Number.MAX_SAFE_INTEGER) {
        try {
            const result = await this.model.find({ ...conditions }, fields_to_return)
                .skip(skip).limit(limit).sort(sort_options);
            return this.jsonize([...result]);
        } catch (e) {
            console.log(`[UserController] read_records: ${e.message}`);
        }
    }

    async update_records(conditions, data_to_set) {
        try {
            const result = await this.model.updateMany({
                ...conditions
            }, {
                ...data_to_set,
                $currentDate: { updated_on: true }
            });

            return this.jsonize(result);
        } catch (e) {
            console.log(`[UserController] update_records Error: ${e.message}`);
        }
    }

    async delete_records(conditions) {
        try {
            const result = await this.model.updateMany({
                ...conditions,
            }, {
                is_active: false,
                is_deleted: true,
                $currentDate: { updated_on: true }
            });

            return this.jsonize(result);
        } catch (e) {
            console.log(`[UserController] delete_records Error: ${e.message}`);
        }
    }
}

module.exports = new UserController();