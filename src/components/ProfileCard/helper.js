import config from "../../config";

/**
 * Returns the availability of the user
 * Availability is an attribute on the user and thus
 * needs to be extracted from the user's profile
 * @param {Object} profile The user profile
 * @param {String} attributeName The attribute for which the value is requested
 */
export function getAttributeDetails(profile, attributeName) {
  const detail = profile.attributes.find(
    (a) => a.attribute.name === attributeName
  );

  switch (attributeName) {
    case config.PRIMARY_ATTRIBUTES.availability:
      return {
        id: detail.attribute.id,
        value: detail.value === "true",
      };
    case config.PRIMARY_ATTRIBUTES.title:
    case config.PRIMARY_ATTRIBUTES.company:
    case config.PRIMARY_ATTRIBUTES.location:
      return {
        id: detail.attribute.id,
        value: detail.value,
      };
    default:
      throw Error(`Unknown attribute ${attributeName}`);
  }
}

/**
 * Returns the user's achievements
 */
export function getAchievements(profile) {
  const achievements = profile.achievements
    ? profile.achievements.map((a) => a.name)
    : [];

  return achievements;
}

/**
 * Returns the initials for the user using the user name
 * @param {String} userName The user name
 */
export function getUserNameInitial(userName) {
  let initials = userName.match(/\b\w/g) || [];
  initials = ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();

  return initials;
}
