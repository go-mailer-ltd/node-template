/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const webhook_service = require('../services/webhook/webhook');
try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await webhook_service.create_record(request, next);
            next();
        })
        .get('/', async (request, response, next) => {
            request.payload = await webhook_service.read_record_by_id(request, next);
            next();
        })
        .get('/registered', async (request, response, next) => {
            request.payload = await webhook_service.read_records_by_filter(request, next);
            next();
        })
        .post('/ping', async (request, response, next) => {
            request.payload = await webhook_service.read_records_by_wildcard(request, next);
            next();
        })
        .post('/new', async (request, response, next) => {
            request.payload = await webhook_service.update_record_by_id(request, next);
            next();
        })
} catch (e) {
    console.log(`[Route Error] /webhooks: ${e.message}`);
} finally {
    module.exports = router;
}