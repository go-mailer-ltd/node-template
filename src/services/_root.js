/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const appEvent = require('../events/_config')
const { buildQuery } = require('../utilities/query')

class RootService {
  constructor () {
    this.standard_metadata = {
      is_active: true,
      is_deleted: false
    }
  }

  async handleDatabaseRead (Controller, query_options, extra_options = {}) {
    const {
      fields_to_return,
      limit,
      seek_conditions,
      skip,
      sort_condition
    } = buildQuery(query_options)

    return await Controller.readRecords(
      { ...seek_conditions, ...extra_options },
      fields_to_return,
      sort_condition,
      skip,
      limit
    )
  }

  processSingleRead (result) {
    if (result && result.id) return this.processSuccessfulResponse(result)
    return this.processFailedResponse('Resource not found', 404)
  }

  processMultipleReadResults (result) {
    if (result && result.data) return this.processSuccessfulResponse(result)
    return this.processFailedResponse('Resources not found', 404)
  }

  processUpdateResult (result, event_name) {
    if (result && result.ok && result.nModified) {
      if (event_name) {
        appEvent.emit(event_name, result)
      }
      return this.processSuccessfulResponse(result)
    }
    if (result && result.ok && !result.nModified) return this.processSuccessfulResponse(result, 210)
    return this.processFailedResponse('Update failed', 200)
  }

  processDeleteResult (result) {
    if (result && result.nModified) return this.processSuccessfulResponse(result)
    return this.processFailedResponse('Deletion failed.', 200)
  }

  /** */

  processFailedResponse (message, code = 400) {
    return {
      error: message,
      payload: null,
      status_code: code
    }
  }

  processSuccessfulResponse (payload, code = 200, send_raw_response = false, response_type = 'application/json') {
    return {
      payload,
      error: null,
      response_type,
      send_raw_response,
      status_code: code
    }
  }

  /** */
  validateEmail (raw_email) {
    const email = raw_email.trim()
    if (email.length < 6) {
      return {
        is_valid: false,
        message: 'Email address is too short.'
      }
    }

    // eslint-disable-next-line no-useless-escape
    const email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const is_valid = email_pattern.test(email)

    return {
      is_valid,
      message: is_valid ? email : 'Invalid email address.'
    }
  }
}

module.exports = RootService
