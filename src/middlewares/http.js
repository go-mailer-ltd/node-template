/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
const { logger } = require('../utilities/logger')

module.exports = {
  handle404 (request, response, next) {
    const return_data = {
      status_code: 404,
      error: 'Resource not found',
      payload: null
    }

    next(return_data)
  },

  handleError (error, request, response, next) {
    // Log errors
    logger.error(error.error || error.message)

    // return error
    return response.status(error.status_code || 500).json({
      status_code: error.status_code || 500,
      error: error.error || 'Internal Server Error',
      payload: null
    })
  },

  processResponse (request, response, next) {
    if (!request.payload) return next()

    const { status_code } = request.payload
    return response.status(status_code).json(request.payload)
  },

  setupRequest (request, response, next) {
    request.headers['access-control-allow-origin'] = '*'
    request.headers['access-control-allow-headers'] = '*'

    if (request.method === 'OPTIONS') {
      request.headers['access-control-allow-methods'] = 'GET, POST, PUT, PATCH, DELETE'
      response.status(200).json()
    }

    next()
  }
}
