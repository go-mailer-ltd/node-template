/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 **/
const mongoose = require('mongoose')
const { app_logger } = require('../utilities/logger')
/** */
class Controller {
  constructor (model_name) {
    this.logger = app_logger(`${model_name} Controller`)
    this.Model = mongoose.model(model_name)
  }

  deleteRecordMetadata (record) {
    const record_to_mutate = { ...record }

    //
    delete record_to_mutate.time_stamp
    delete record_to_mutate.created_on
    delete record_to_mutate.updated_on
    delete record_to_mutate.__v

    //
    return { ...record_to_mutate }
  }

  jsonize (data) {
    return JSON.parse(JSON.stringify(data))
  }

  async setUniqueKey (model, _id, time_stamp) {
    const n = (await model.estimatedDocumentCount({ time_stamp: { $lt: time_stamp } })) + 1
    await model.updateOne({ _id }, { id: n })
    return n
  }

  /** */

  async createRecord (data) {
    try {
      const record_to_create = new this.Model({ ...data })
      const created_record = await record_to_create.save()

      return {
        ...this.jsonize(created_record),
        id: await this.setUniqueKey(this.Model, created_record._id, created_record.time_stamp)
      }
    } catch (e) {
      this.logger.error(e.message, 'createRecord')
    }
  }

  async readRecords (conditions, fields_to_return = '', sort_options = '', skip = 0, limit = Number.MAX_SAFE_INTEGER) {
    try {
      let result = null

      result = await Promise.all([
        this.Model.countDocuments({ ...conditions }),
        this.Model.find({ ...conditions }, fields_to_return)
          .skip(skip)
          .limit(limit)
          .sort(sort_options)
      ])
      const [count, records] = result
      return this.jsonize({
        data: records,
        meta: {
          size: count,
          next_page: skip / limit + 1
        }
      })
    } catch (e) {
      this.logger.error(e.message, 'readRecords')
    }
  }

  async updateRecords (conditions, data) {
    try {
      const data_to_set = this.deleteRecordMetadata(data)
      const result = await this.Model.updateMany(
        {
          ...conditions
        },
        {
          ...data_to_set,
          $currentDate: { updated_on: true }
        }
      )

      return this.jsonize({ ...result, data })
    } catch (e) {
      this.logger.error(e.message, 'updateRecords')
    }
  }

  async deleteRecords (conditions) {
    try {
      const result = await this.Model.updateMany(
        {
          ...conditions
        },
        {
          is_active: false,
          is_deleted: true,
          $currentDate: { updated_on: true }
        }
      )

      return this.jsonize(result)
    } catch (e) {
      this.logger.error(e.message, 'deleteRecords')
    }
  }
}

module.exports = Controller
