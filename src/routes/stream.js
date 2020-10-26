/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const stream_rule_service = require('../services/stream/rule');
try {
    router
        .post('/organisation', async (request, response, next) => {
            request.payload = await stream_rule_service.add_rule(request, next);
            next();
        })
        .get('/organisation/:org_id', async (request, response, next) => {
            request.payload = await stream_rule_service.read_rules(request, next);
            next();
        })
        .post('/reply/tweet', async (request, response, next) => {
            request.payload = await stream_rule_service.create_record(request, next);
            next();
        })
        .post('/reply/direct-message', async (request, response, next) => {
            request.payload = await stream_rule_service.create_record(request, next);
            next();
        })
} catch (e) {
    console.log(`[Route Error] /streams: ${e.message}`);
} finally {
    module.exports = router;
}