/**
 * Contains all routes.
 */
const multer = require('multer')
const config = require('config')
const _ = require('lodash')
const constants = require('../app-constants')
const fileUpload = multer({ storage: multer.memoryStorage() })

// config template upload properties
const templateUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(config.TEMPLATE_FILE_MAX_SIZE) },
  fileFilter: (req, file, cb) => {
    if (_.includes(_.split(config.TEMPLATE_FILE_MIMETYPE, ','), file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

module.exports = {
  '/uploads': {
    post: {
      controller: 'UploadController',
      method: 'uploadEntity',
      upload: fileUpload.single('upload'),
      auth: 'jwt',
      access: constants.AdminUser,
      scopes: [constants.Scopes.CreateUpload, constants.Scopes.AllUpload]
    }
  },
  '/uploads/:id': {
    get: {
      controller: 'UploadController',
      method: 'getEntity',
      auth: 'jwt',
      access: constants.AdminUser,
      scopes: [constants.Scopes.GetUpload, constants.Scopes.AllUpload]
    },
    patch: {
      controller: 'UploadController',
      method: 'partiallyUpdate',
      auth: 'jwt',
      access: constants.AdminUser,
      scopes: [constants.Scopes.UpdateUpload, constants.Scopes.AllUpload]
    }
  },
  '/templates': {
    post: {
      controller: 'TemplateController',
      method: 'uploadEntity',
      upload: templateUpload.single('template'),
      auth: 'jwt',
      access: constants.AllAuthenticatedUsers,
      scopes: [constants.Scopes.CreateTemplate, constants.Scopes.AllTemplate]
    }
  },
  '/templates/:id': {
    get: {
      controller: 'TemplateController',
      method: 'getEntity',
      auth: 'jwt',
      access: constants.AdminUser,
      scopes: [constants.Scopes.GetTemplate, constants.Scopes.AllTemplate]
    }
  },
  '/health': {
    get: {
      controller: 'HealthCheckController',
      method: 'check'
    }
  }
}
