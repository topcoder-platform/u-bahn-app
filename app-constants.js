/**
 * App constants
 */
const UserRoles = {
  admin: 'Admin',
  administrator: 'Administrator',
  topcoderUser: 'Topcoder User',
  copilot: 'Copilot'
}

const Scopes = {
  CreateUpload: 'create:upload',
  GetUpload: 'read:upload',
  UpdateUpload: 'update:upload',
  AllUpload: 'all:upload',
  CreateTemplate: 'create:template',
  GetTemplate: 'read:template',
  AllTemplate: 'all:template',
  GetSkill: 'read:skill',
  AllSkill: 'all:skill'
}

const AllAuthenticatedUsers = [UserRoles.admin, UserRoles.administrator, UserRoles.topcoderUser, UserRoles.copilot]

module.exports = {
  Scopes,
  AllAuthenticatedUsers
}
