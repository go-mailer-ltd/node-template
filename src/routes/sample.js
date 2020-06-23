/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const sample_service = require('../services/sample/sample');

router.post('/', async (request, response, next) => {
    request.payload = await sample_service.create_record(request, next);
    next();
}); // CREATE a new record

router.get('/', async (request, response, next) => {
    request.payload = await sample_service.read_records_by_filter(request, next);
    next();
}); // GET ALL Records

router.get('/:id', async (request, response, next) => {
    request.payload = await sample_service.read_record_by_id(request, next);
    next();
})  // GET Record by ID

router.get('/search/:keys/:keyword', async (request, response, next) => {
    request.payload = await sample_service.read_records_by_wildcard(request, next);
    next();
});// GET by keyword

router.put('/:id', async (request, response, next) => {
    request.payload = await sample_service.update_record_by_id(request, next);
    next();
}); //UPDATE Record by ID

router.put('/', async (request, response, next) => {
    request.payload = await sample_service.update_records(request, next);
    next();
}); // UPDATE Record(s) by user defined conditions

router.delete('/:id', async (request, response, next) => {
    request.payload = await sample_service.delete_record_by_id(request, next);
    next();
}); // DELETE Record by ID

router.delete('/', async (request, response, next) => {
    request.payload = await sample_service.delete_records(request, next);
    next();
}); // DELETE Record(s) by user defined conditions


module.exports = router;