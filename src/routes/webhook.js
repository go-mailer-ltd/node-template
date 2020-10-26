/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const webhook_service = require('../services/webhook/webhook');
try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await webhook_service.handle_incoming_event(request, next);
            next();
        })
        .get('/', async (request, response, next) => {
            request.payload = await webhook_service.verify_crc(request, next);
            next();
        })
        .get('/registered', async (request, response, next) => {
            request.payload = await webhook_service.retrieve_webhook(request, next);
            next();
        })
        .post('/ping/:webhook_id', async (request, response, next) => {
            request.payload = await webhook_service.ping_webhook(request, next);
            next();
        })
        .post('/new', async (request, response, next) => {
            request.payload = await webhook_service.register_webhook(request, next);
            next();
        })
} catch (e) {
    console.log(`[Route Error] /webhooks: ${e.message}`);
} finally {
    module.exports = router;
}