/**
 * This defines Upload model.
 */
const config = require('config')
const dynamoose = require('dynamoose')

const Schema = dynamoose.Schema

const schema = new Schema({
  id: {
    type: String,
    hashKey: true,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: false
  },
  objectKey: {
    type: String,
    required: true
  },
  organizationId: {
    type: String,
    required: true
  },
  created: {
    type: String,
    required: true
  },
  updated: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  }
},
{
  throughput: {
    read: Number(config.AMAZON.DYNAMODB_READ_CAPACITY_UNITS),
    write: Number(config.AMAZON.DYNAMODB_WRITE_CAPACITY_UNITS)
  }
})

module.exports = schema
