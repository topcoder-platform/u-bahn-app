/**
 * roles that used in service, all roles must match topcoder roles
 * Admin and Administrator are both admin user
 */
const UserRoles = {
  admin: 'Admin',
  administrator: 'Administrator',
  topcoderUser: 'Topcoder User',
  copilot: 'Copilot',
  ubahn: 'u-bahn'
}
/**
 * all authenticated users.
 * @type {(string)[]}
 */
const AllAuthenticatedUsers = [
  UserRoles.admin,
  UserRoles.administrator,
  UserRoles.topcoderUser,
  UserRoles.copilot,
  UserRoles.ubahn
]

/**
 * all admin user
 */
const AdminUser = [UserRoles.admin, UserRoles.administrator]

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

module.exports = {
  AllAuthenticatedUsers,
  AdminUser,
  Scopes
}
