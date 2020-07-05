/**
 * Controller for Template endpoints
 */
const service = require('../services/TemplateService')

/**
 * Upload template
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function uploadEntity (req, res) {
  const result = await service.uploadEntity(req.authUser, req.file, req.body)
  res.send(result)
}

/**
 * Get template
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getEntity (req, res) {
  const result = await service.getEntity(req.params.id)
  res.send(result)
}

module.exports = {
  uploadEntity,
  getEntity
}
