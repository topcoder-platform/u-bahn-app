/**
 * Controller for Skill endpoints
 */
const service = require('../services/SkillService')

/**
 * Get skills
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getEntity (req, res) {
  const result = await service.getEntity(req.query.q)
  res.send(result)
}

module.exports = {
  getEntity
}
