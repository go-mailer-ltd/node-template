/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
const mongoose = require('mongoose');

/** */
class Controller {
    constructor (model_name) {
        this.model = mongoose.model(model_name);
    }
    
    deleteRecordMetadata (record) {
        let record_to_mutate = { ...record };

        //
        delete record_to_mutate.timestamp;
        delete record_to_mutate.created_on;
        delete record_to_mutate.updated_on;
        delete record_to_mutate._v;

        //
        return { ...record_to_mutate };
    }

    jsonize(data) {
        return JSON.parse(JSON.stringify(data))
    }

    async setUniqueKey (model, _id, time_stamp) {
        const n = (await model.estimatedDocumentCount({ time_stamp: { $lt: time_stamp } })) + 1;
        await model.updateOne({ _id }, { id: n });
        return n;
    }

    /** */

    async createRecord(data) {
        try {
            const record_to_create = new this.model({ ...data });
            const created_record = await record_to_create.save();

            return {
                ...this.jsonize(created_record),
                id: await this.setUniqueKey(this.model, created_record._id, created_record.time_stamp),
            };
        } catch (e) {
            console.log(`[SampleController] create_record Error: ${e.message}`);
        }
    }

    async readRecords(conditions, fields_to_return = '', sort_options = '', count = false, skip = 0, limit = Number.MAX_SAFE_INTEGER) {
        try {
            let result = null;
            if (count) {
                result = await this.model.countDocuments({ ...conditions })
                    .skip(skip)
                    .limit(limit)
                    .sort(sort_options);
                return {
                    count: result,
                };
            } else {
                result = await this.model.find({ ...conditions }, fields_to_return)
                    .skip(skip)
                    .limit(limit)
                    .sort(sort_options);
                return this.jsonize([...result]);
            }
        } catch (e) {
            console.log(`[SampleController] read_records: ${e.message}`);
        }
    }

    async updateRecords(conditions, data) {
        try {
            const data_to_set = this.deleteRecordMetadata(data);
            const result = await this.model.updateMany({
                ...conditions
            }, {
                ...data_to_set,
                $currentDate: { updated_on: true }
            });

            return this.jsonize({ ...result, data });
        } catch (e) {
            console.log(`[SampleController] update_records Error: ${e.message}`);
        }
    }

    async deleteRecords(conditions) {
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
            console.log(`[SampleController] delete_records Error: ${e.message}`);
        }
    }
}

module.exports = Controller;