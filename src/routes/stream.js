/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

require('../services/stream/stream');
const router = require('express').Router();
const stream_rule_service = require('../services/stream/rule');
const user_service = require('../services/user/user');
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
            request.payload = await user_service.respond_to_activity(request, 'comment', next);
            next();
        })
        .post('/reply/direct-message', async (request, response, next) => {
            request.payload = await user_service.respond_to_activity(request, 'dm', next);
            next();
        })
} catch (e) {
    console.log(`[Route Error] /streams: ${e.message}`);
} finally {
    module.exports = router;
}