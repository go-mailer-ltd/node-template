/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router()
const sampleService = require('../services/sample')

try {
  router
    .post('/', async (request, __, next) => {
      request.payload = await sampleService.createRecord(request, next)
      next()
    })
    .get('/', async (request, __, next) => {
      request.payload = await sampleService.readRecordsByFilter(request, next)
      next()
    })
    .get('/:id', async (request, __, next) => {
      request.payload = await sampleService.readRecordById(request, next)
      next()
    })
    .get('/search/:fields', async (request, __, next) => {
      request.payload = await sampleService.readRecordsByWildcard(request, next)
      next()
    })
    .put('/:id', async (request, __, next) => {
      request.payload = await sampleService.updateRecordById(request, next)
      next()
    })
    .put('/', async (request, __, next) => {
      request.payload = await sampleService.updateRecords(request, next)
      next()
    })
    .delete('/:id', async (request, __, next) => {
      request.payload = await sampleService.deleteRecordById(request, next)
      next()
    })
    .delete('/', async (request, __, next) => {
      request.payload = await sampleService.deleteRecords(request, next)
      next()
    })
} catch (e) {
  console.log(`[Route Error] /samples: ${e.message}`)
} finally {
  module.exports = router
}
