/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const Controller = require('../controllers/index');
const sampleSchemaValitor = require('../validators/sample');

const sampleController = new Controller('Sample');
const SampleService = require('../services/sample/sample');
const sampleService = new SampleService(sampleController, sampleSchemaValitor);

try {
    router
    .post('/', async (request, response, next) => {
        request.payload = await sampleService.createRecord(request, next);
        next();
    })
    .get('/', async (request, response, next) => {
        request.payload = await sampleService.readRecordsByFilter(request, next);
        next();
    })
    .get('/:id', async (request, response, next) => {
        request.payload = await sampleService.readRecordById(request, next);
        next();
    })
    .get('/search/:keys/:keyword', async (request, response, next) => {
        request.payload = await sampleService.readRecordsByWildcard(request, next);
        next();
    })
    .put('/:id', async (request, response, next) => {
        request.payload = await sampleService.updateRecordById(request, next);
        next();
    })
    .put('/', async (request, response, next) => {
        request.payload = await sampleService.updateRecords(request, next);
        next();
    })
    .delete('/:id', async (request, response, next) => {
        request.payload = await sampleService.deleteRecordById(request, next);
        next();
    })
    .delete('/', async (request, response, next) => {
        request.payload = await sampleService.deleteRecords(request, next);
        next();
    })
} catch (e) {
    console.log(`[Route Error] /samples: ${e.message}`);
} finally {    
    module.exports = router;
}