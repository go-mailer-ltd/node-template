/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const sample_service = require('../services/sample/sample');

router
    .post('/', async (request, response, next) => {
        request.payload = await sample_service.create_record(request, next);
        next();
    })
    .get('/', async (request, response, next) => {
        request.payload = await sample_service.read_records_by_filter(request, next);
        next();
    })
    .get('/:id', async (request, response, next) => {
        request.payload = await sample_service.read_record_by_id(request, next);
        next();
    })
    .get('/search/:keys/:keyword', async (request, response, next) => {
        request.payload = await sample_service.read_records_by_wildcard(request, next);
        next();
    })
    .put('/:id', async (request, response, next) => {
        request.payload = await sample_service.update_record_by_id(request, next);
        next();
    })
    .put('/', async (request, response, next) => {
        request.payload = await sample_service.update_records(request, next);
        next();
    })
    .delete('/:id', async (request, response, next) => {
        request.payload = await sample_service.delete_record_by_id(request, next);
        next();
    })
    .delete('/', async (request, response, next) => {
        request.payload = await sample_service.delete_records(request, next);
        next();
    })

module.exports = router;