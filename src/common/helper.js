/**
 * This file defines helper methods
 */
const _ = require('lodash')
const config = require('config')
const AWS = require('aws-sdk')
const path = require('path')
const axios = require('axios')
const querystring = require('querystring')
const NodeCache = require('node-cache')
const models = require('../models')
const errors = require('./errors')
const logger = require('./logger')
const busApi = require('tc-bus-api-wrapper')
const busApiClient = busApi(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET', 'BUSAPI_URL', 'KAFKA_ERROR_TOPIC', 'AUTH0_PROXY_SERVER_URL']))

// AWS DynamoDB instance
let dbInstance

AWS.config.update({
  accessKeyId: config.AMAZON.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AMAZON.AWS_SECRET_ACCESS_KEY,
  region: config.AMAZON.AWS_REGION
})

const s3 = new AWS.S3()
/**
 * Wrap async function to standard express function
 * @param {Function} fn the async function
 * @returns {Function} the wrapped function
 */
function wrapExpress (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

/**
 * Wrap all functions from object
 * @param obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
function autoWrapExpress (obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress)
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'AsyncFunction') {
      return wrapExpress(obj)
    }
    return obj
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value)
  })
  return obj
}

/**
 * Get DynamoDB Connection Instance
 * @return {Object} DynamoDB Connection Instance
 */
function getDb () {
  // cache it for better performance
  if (!dbInstance) {
    if (config.AMAZON.IS_LOCAL_DB) {
      dbInstance = new AWS.DynamoDB({ endpoint: config.AMAZON.DYNAMODB_URL })
    } else {
      dbInstance = new AWS.DynamoDB()
    }
  }
  return dbInstance
}

/**
 * Creates table in DynamoDB
 * @param     {object} model Table structure in JSON format
 * @return    {promise} the result
 */
async function createTable (model) {
  const db = getDb()
  return new Promise((resolve, reject) => {
    db.createTable(model, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * Deletes table in DynamoDB
 * @param     {String} tableName Name of the table to be deleted
 * @return    {promise} the result
 */
async function deleteTable (tableName) {
  const db = getDb()
  const item = {
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    db.deleteTable(item, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * Get Data by model id
 * @param {String} modelName The dynamoose model name
 * @param {String} id The id value
 * @returns found record
 */
async function getById (modelName, id) {
  return new Promise((resolve, reject) => {
    models[modelName].query('id').eq(id).exec((err, result) => {
      if (err) {
        reject(err)
      } else if (result.length > 0) {
        resolve(result[0])
      } else {
        reject(new errors.NotFoundError(`${modelName} with id: ${id} doesn't exist`))
      }
    })
  })
}

/**
 * Create item in database
 * @param {Object} modelName The dynamoose model name
 * @param {Object} data The create data object
 * @returns created entity
 */
async function create (modelName, data) {
  return new Promise((resolve, reject) => {
    const dbItem = new models[modelName](data)
    dbItem.save((err) => {
      if (err) {
        reject(err)
      } else {
        resolve(dbItem)
      }
    })
  })
}

/**
 * Update item in database
 * @param {Object} dbItem The Dynamo database item
 * @param {Object} data The updated data object
 * @returns updated entity
 */
async function update (dbItem, data) {
  Object.keys(data).forEach((key) => {
    dbItem[key] = data[key]
  })
  return new Promise((resolve, reject) => {
    dbItem.save((err) => {
      if (err) {
        reject(err)
      } else {
        resolve(dbItem)
      }
    })
  })
}

/**
 * Upload file to S3
 * @param {string} bucket bucket name
 * @param {buffer} file file data
 * @param {string} fileName key
 * @returns {string} objectKey
 */
async function uploadToS3 (bucket, file, fileName) {
  const extension = path.extname(file.originalname)

  if (fileName.indexOf(extension) === -1) {
    fileName = `${fileName}${extension}`
  }

  await s3.upload({
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      originalname: file.originalname
    }
  }).promise()
  return fileName
}

/**
 * Generate signed url
 * @param {string} objectKey s3 object key
 * @returns {string} signed url
 */
function generateS3Url (objectKey) {
  const url = s3.getSignedUrl('getObject', {
    Bucket: config.UPLOAD_S3_BUCKET,
    Key: objectKey,
    Expires: parseInt(config.S3_OBJECT_URL_EXPIRY_TIME)
  })
  return url
}

/**
 * Get data collection by scan parameters
 * @param {Object} modelName The dynamoose model name
 * @param {Object} scanParams The scan parameters object
 * @returns found records
 */
async function scan (modelName, scanParams) {
  return new Promise((resolve, reject) => {
    models[modelName].scan(scanParams).exec((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.count === 0 ? [] : result)
      }
    })
  })
}

/**
 * Validate the data to ensure no duplication
 * @param {Object} modelName The dynamoose model name
 * @param {String} keys The attribute name of dynamoose model
 * @param {String} values The attribute value to be validated
 */
async function validateDuplicate (modelName, keys, values) {
  const options = {}
  if (Array.isArray(keys)) {
    if (keys.length !== values.length) {
      throw new errors.BadRequestError(`size of ${keys} and ${values} do not match.`)
    }

    keys.forEach(function (key, index) {
      options[key] = { eq: values[index] }
    })
  } else {
    options[keys] = { eq: values }
  }

  const records = await scan(modelName, options)
  if (records.length > 0) {
    if (Array.isArray(keys)) {
      let str = `${modelName} with [ `

      for (const i in keys) {
        const key = keys[i]
        const value = values[i]

        str += `${key}: ${value}`
        if (i < keys.length - 1) { str += ', ' }
      }

      throw new errors.ConflictError(`${str} ] already exists`)
    } else {
      throw new errors.ConflictError(`${modelName} with ${keys}: ${values} already exists`)
    }
  }
}

/**
 * Send Kafka event message
 * @params {String} topic the topic name
 * @params {Object} payload the payload
 */
async function postEvent (topic, payload) {
  logger.info(`Publish event to Kafka topic ${topic}`)
  const message = {
    topic,
    originator: config.KAFKA_MESSAGE_ORIGINATOR,
    timestamp: new Date().toISOString(),
    'mime-type': 'application/json',
    payload
  }
  await busApiClient.postEvent(message)
}

// cache the emsi token
const tokenCache = new NodeCache()

/**
 * Get emsi token
 * @returns {string} the emsi token
 */
async function getEmsiToken () {
  let token = tokenCache.get('emsi_token')
  if (!token) {
    const res = await axios.post(config.EMSI.AUTH_URL, querystring.stringify({
      client_id: config.EMSI.CLIENT_ID,
      client_secret: config.EMSI.CLIENT_SECRET,
      grant_type: config.EMSI.GRANT_TYPE,
      scope: config.EMSI.SCOPE
    }))
    token = res.data.access_token
    tokenCache.set('emsi_token', token, res.data.expires_in)
  }
  return token
}

/**
 * Get data from emsi
 * @param {String} path the emsi endpoint path
 * @param {String} params get params
 * @returns {Object} response data
 */
async function getEmsiObject (path, params) {
  const token = await getEmsiToken()
  const res = await axios.get(`${config.EMSI.BASE_URL}${path}`, { params, headers: { authorization: `Bearer ${token}` } })
  return res.data
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  createTable,
  deleteTable,
  getById,
  create,
  update,
  uploadToS3,
  generateS3Url,
  scan,
  validateDuplicate,
  postEvent,
  getEmsiObject
}
