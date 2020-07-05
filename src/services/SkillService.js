/**
 * This service provides operations of skills.
 */
const helper = require('../common/helper')
const logger = require('../common/logger')

/**
 * Get skills by query param q.
 * @param {String} q the query param
 * @returns {Object} the Object with skills
 */
async function getEntity (q) {
  const res = await helper.getEmsiObject('/skills', { q })
  return res
}

module.exports = {
  getEntity
}

logger.buildService(module.exports)
