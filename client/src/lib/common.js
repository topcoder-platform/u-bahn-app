import config from "../config";

/**
 * Returns the nickname of the logged in user
 * @param {Object} auth0User The auth0 user object
 */
export function getNickname(auth0User) {
  return auth0User[config.AUTH0.handleClaims];
}
