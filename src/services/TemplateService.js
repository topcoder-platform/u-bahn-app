/**
 * This service provides operations of devices.
 */
const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const { v4: uuid } = require('uuid')
const helper = require('../common/helper')
const logger = require('../common/logger')

/**
 * Get template entity by id.
 * @param {String} id the template id
 * @returns {Object} the template of given id
 */
async function getEntity (id) {
  const template = await helper.getById(config.AMAZON.DYNAMODB_TEMPLATE_TABLE, id)
  const res = _.extend(_.omit(_.pickBy(template, _.isString), 'objectKey'), { url: helper.generateS3Url(template.objectKey) })
  return res
}

getEntity.schema = {
  id: Joi.id()
}

/**
 * Upload template file and save the objectKey.
 * @param {Object} data the data of the template
 * @returns {Object} the template object
 */
async function uploadEntity (authUser, template, data) {
  await helper.validateDuplicate(config.AMAZON.DYNAMODB_TEMPLATE_TABLE, 'name', data.name)
  // upload file to s3 under templates folder
  const objectKey = await helper.uploadToS3(config.TEMPLATE_S3_BUCKET, template, `templates/${data.name}`)

  const currDate = new Date().toISOString()
  const item = _.extend({
    id: uuid(),
    objectKey,
    created: currDate,
    updated: currDate,
    createdBy: authUser.handle || authUser.sub,
    updatedBy: authUser.handle || authUser.sub
  }, data)
  // create record in db
  await helper.create(config.AMAZON.DYNAMODB_TEMPLATE_TABLE, item)

  const res = _.extend(_.omit(item, 'objectKey'), { url: helper.generateS3Url(objectKey) })
  return res
}

uploadEntity.schema = {
  authUser: Joi.object().required(),
  template: Joi.object().required(),
  data: Joi.object().keys({
    name: Joi.string().required()
  }).required()
}

module.exports = {
  getEntity,
  uploadEntity
}

logger.buildService(module.exports)
