/**
 * Controller for Upload endpoints
 */
const service = require('../services/UploadService')

/**
 * Create upload
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function uploadEntity (req, res) {
  const result = await service.create(req.authUser, req.file)
  res.send(result)
}

/**
 * Get upload
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getEntity (req, res) {
  const result = await service.getEntity(req.params.id)
  res.send(result)
}

/**
 * Partially update upload
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function partiallyUpdate (req, res) {
  const result = await service.partiallyUpdate(req.authUser, req.params.id, req.body)
  res.send(result)
}

module.exports = {
  getEntity,
  uploadEntity,
  partiallyUpdate
}
