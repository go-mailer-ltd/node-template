/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const user_service = require('../services/user/user');
try {
    router
        .post('/token/access', async (request, response, next) => {
            request.payload = await user_service.obtain_access_token(request, next);
            next();
        })
        .get('/token/request', async (request, response, next) => {
            request.payload = await user_service.obtain_request_token(request, next);
            next();
        })
        .get('/:org_id', async (request, response, next) => {
            request.payload = await user_service.read_organisation_record(request, next);
            next();
        })
        .delete('/:org_id', async (request, response, next) => {
            request.payload = await user_service.delete_organisation_record(request, next);
            next();
        })
} catch (e) {
    console.log(`[Route Error] /users: ${e.message}`);
} finally {
    module.exports = router;
}