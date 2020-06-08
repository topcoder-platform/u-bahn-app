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
 * @param {Object} profile The user profile
 */
export function getAchievements(profile) {
  const achievements = profile.achievements
    ? profile.achievements.map((a) => a.name)
    : [];

  return achievements;
}

/**
 * Returns the user's skills
 * @param {Object} profile The user profile
 */
export function getSkills(profile) {
  const skills = profile.skills
    ? profile.skills.map((a) => ({ name: a.skill.name, id: a.skillId }))
    : [];

  return skills;
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

export async function updateUserSkills(api, { id, skills }) {
  let url;

  for (let i = 0; i < skills.length; i++) {
    if (skills[i].isDeleted) {
      url = `${config.API_URL}/users/${id}/skills/${skills[i].id}`;

      await api.delete(url);
    }
  }
}
