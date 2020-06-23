/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const { process_response } = require('../utilities/http-reponse');
const { logger } = require('../utilities/logger');

/** Cross Origin Handling */
router.use((request, response, next) => {
    request.headers['access-control-allow-origin'] = '*';
    request.headers['access-control-allow-headers'] = '*';

    if (request.method === 'OPTIONS') {
        request.headers['access-control-allow-methods'] = 'GET, POST, PUT, PATCH, DELETE';
        response.status(200).json();
    }

    next();
});

/** Route Handlers */
const sample_route_handler = require('./sample');

/** Routes Definition */
router.use('/samples', sample_route_handler);
router.use(process_response);

/** Static Routes */
router.use('/files/image/:image_name', (request, response) => {

});

router.use((request, response, next) => {
    const return_data = {
        status_code: 404,
        success: false,
        error: `Resource not found`,
        payload: null
    };

    next(return_data);
});

/** Uncaught Error handler */
router.use((error, request, response, next) => {
    // Log errors
    logger.error(error.error);

    // return error
    return response.status(error.status_code || 500).json({
        success: false,
        status_code: error.status_code,
        error: error.error || `Internal Server Error`,
        payload: null
    });
});

module.exports = router;