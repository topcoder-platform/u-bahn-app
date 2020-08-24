/**
 * add logger and joi to services
 */

const fs = require('fs')
const path = require('path')
const logger = require('./src/common/logger')

global.Promise = require('bluebird')
const Joi = require('joi')

Joi.id = () => Joi.string().uuid().required()

/**
 * add logger and joi schema to service
 * @param dir
 */
function buildServices (dir) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const curPath = path.join(dir, file)
    const stats = fs.statSync(curPath)
    if (stats.isDirectory()) {
      buildServices(curPath)
    } else if (path.extname(file) === '.js') {
      logger.buildService(require(curPath)); // eslint-disable-line
    }
  })
}

buildServices(path.join(__dirname, 'src', 'services'))
