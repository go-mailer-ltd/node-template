/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router()
const {
  handle404,
  handleError,
  setupRequest,
  processResponse
} = require('../middlewares/http')

/** Route Handlers */
const sample_route_handler = require('./sample')

/** Cross Origin Handling */
router.use(setupRequest)
router.use('/samples', sample_route_handler)
router.use(processResponse)

/** Static Routes */
router.use('/image/:image_name', (request, response) => {

})

router.use(handle404)
router.use(handleError)

module.exports = router
