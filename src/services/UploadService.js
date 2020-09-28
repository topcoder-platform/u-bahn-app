/**
 * This service provides operations of uploads.
 */
const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const { v4: uuid } = require('uuid')
const FileType = require('file-type')
const errors = require('../common/errors')
const helper = require('../common/helper')
const logger = require('../common/logger')

/**
 * Checks the type of uploaded file and ensures it's allowed.
 * @param {Object} upload The uploaded file
 */
async function ensureFileTypeIsValid (upload) {
  const allowedExtensions = ['xls', 'xlsx', 'csv']
  const allowedMimeTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ]
  const fileType = await FileType.fromBuffer(upload.buffer)
  const fileExt = upload.originalname.split('.').pop().toLowerCase()

  const isValidMimeType = fileType && _.includes(allowedMimeTypes, fileType.mime)
  const isValidExt = _.includes(allowedExtensions, fileExt)
  const isAllowed = fileType !== undefined ? isValidMimeType : isValidExt
  if (isAllowed === false) {
    throw new errors.ForbiddenError(`You are allowed to upload only ${_.join(allowedExtensions, ',')} types.`)
  }
}

/**
 * Returns all uploads (filtered by created date)
 * @param {Object} query the filter query
 * @returns {Object} the upload of given id
 */
async function getEntities (query) {
  if (!query.from) {
    query.from = (new Date((new Date()).setDate((new Date()).getDate() - 1)).toISOString()) // 24 hours ago
  }
  const uploads = await helper.getAll(config.AMAZON.DYNAMODB_UPLOAD_TABLE, { created: { ge: query.from } })
  const res = _.map(uploads, (upload) => {
    upload = _.extend(
      _.omit(
        _.pickBy(upload, _.isString),
        ['objectKey', 'failedRecordsObjectKey']
      ),
      {
        url: helper.generateS3Url(upload.objectKey),
        failedRecordsUrl: helper.generateS3Url(upload.failedRecordsObjectKey)
      }
    )

    return upload
  })
  return res
}

getEntity.schema = {
  query: Joi.object().keys({
    from: Joi.date().iso()
  })
}

/**
 * Get upload entity by id.
 * @param {String} id the upload id
 * @returns {Object} the upload of given id
 */
async function getEntity (id) {
  // get from DB
  const upload = await helper.getById(config.AMAZON.DYNAMODB_UPLOAD_TABLE, id)
  const res = _.extend(
    _.omit(
      _.pickBy(upload, _.isString),
      ['objectKey', 'failedRecordsObjectKey']),
    {
      url: helper.generateS3Url(upload.objectKey),
      failedRecordsUrl: helper.generateS3Url(upload.failedRecordsObjectKey)
    }
  )
  return res
}

getEntity.schema = {
  id: Joi.id()
}

/**
 * Create upload.
 * @param {Object} upload the file to upload
 * @param {String} data the related data of the upload
 * @returns {Object} the created upload
 */
async function create (authUser, upload, data) {
  await ensureFileTypeIsValid(upload)
  const id = uuid()
  // upload file to s3 under uploads folder
  const objectKey = await helper.uploadToS3(config.UPLOAD_S3_BUCKET, upload, `uploads/${id}`)

  const currDate = new Date().toISOString()
  const item = {
    id,
    objectKey,
    status: 'pending',
    info: '',
    organizationId: data.organizationId,
    created: currDate,
    updated: currDate,
    createdBy: authUser.handle || authUser.sub,
    updatedBy: authUser.handle || authUser.sub
  }
  // create record in db
  await helper.create(config.AMAZON.DYNAMODB_UPLOAD_TABLE, item)

  const event = _.extend(item, { resource: 'upload' })

  // Send Kafka message using bus api
  await helper.postEvent(config.UPLOAD_CREATE_TOPIC, event)

  const res = _.extend(_.omit(item, 'objectKey'), { url: helper.generateS3Url(objectKey) })

  return res
}

create.schema = {
  authUser: Joi.object().required(),
  upload: Joi.object().required(),
  data: Joi.object().keys({
    organizationId: Joi.string().required()
  })
}

/**
 * Partially update upload.
 * @param {String} id the upload id
 * @param {Object} data the data to update upload
 * @returns {Object} the updated upload
 */
async function partiallyUpdate (authUser, id, data) {
  // get data in DB
  const upload = await helper.getById(config.AMAZON.DYNAMODB_UPLOAD_TABLE, id)

  _.extend(upload, { status: data.status, updatedBy: authUser.handle || authUser.sub, updated: new Date().toISOString() })
  if (data.info) {
    upload.info = data.info
  }
  // then update data in DB
  await helper.update(upload, data)
  const res = _.extend(
    _.omit(
      _.pickBy(upload, _.isString),
      ['objectKey', 'failedRecordsObjectKey']),
    {
      url: helper.generateS3Url(upload.objectKey),
      failedRecordsUrl: helper.generateS3Url(upload.failedRecordsObjectKey)
    }
  )
  return res
}

partiallyUpdate.schema = {
  id: Joi.id(),
  authUser: Joi.object().required(),
  data: Joi.object().keys({
    status: Joi.string().valid('pending', 'completed', 'failed').required(),
    info: Joi.string(),
    failedRecordsObjectKey: Joi.string()
  }).required()
}

module.exports = {
  getEntities,
  getEntity,
  create,
  partiallyUpdate
}

logger.buildService(module.exports)
