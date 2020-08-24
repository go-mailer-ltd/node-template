/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const {
    handle_404,
    handle_error,
    setup_request,
    process_response,
} = require('../middlewares/http');

/** Route Handlers */
const sample_route_handler = require('./sample');

/** Cross Origin Handling */
router.use(setup_request);
router.use('/samples', sample_route_handler);
router.use(process_response);

/** Static Routes */
router.use('/image/:image_name', (request, response) => {

});

router.use(handle_404);
router.use(handle_error);

module.exports = router;