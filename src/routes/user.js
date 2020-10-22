/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const sample_service = require('../services/sample/sample');
try {
    router
        .post('/token/access', async (request, response, next) => {
            request.payload = await sample_service.create_record(request, next);
            next();
        })
        .get('/token/request', async (request, response, next) => {
            request.payload = await sample_service.read_records_by_filter(request, next);
            next();
        })
        .get('/:org_id', async (request, response, next) => {
            request.payload = await sample_service.read_record_by_id(request, next);
            next();
        })
        .delete('/:id', async (request, response, next) => {
            request.payload = await sample_service.delete_record_by_id(request, next);
            next();
        })
} catch (e) {
    console.log(`[Route Error] /samples: ${e.message}`);
} finally {
    module.exports = router;
}