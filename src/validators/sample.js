/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const Joi = require('@hapi/joi')

module.exports = Joi.object({
  id: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
  compound_index_a: Joi.string().required(),
  compound_index_b: Joi.number().required()
})
