import config from "../../config";

/**
 * Checks if the skill exists by using its provider id and external id
 * If it exists, it will return the skill else will return null
 * @param {Object} apiClient The api client
 * @param {String} skillProviderId The skill provider id
 * @param {String} skillExternalId The skill external id
 */
async function checkIfSkillExists(apiClient, skillProviderId, skillExternalId) {
  const url = `${config.API_URL}/skills?skillProviderId=${skillProviderId}&externalId=${skillExternalId}`;
  let response = {};

  try {
    response = await apiClient.get(url);
  } catch (error) {
    console.log(error);
    // TODO - handle error
  }

  if (response.data && response.data.id) {
    return response.data;
  }

  return null;
}

/**
 * Assigns a skill to a user
 * @param {Object} apiClient The api client
 * @param {Object} userSkill Details of the user skill
 */
async function addSkillToUser(apiClient, userSkill) {
  const url = `${config.API_URL}/users/${userSkill.userId}/skills`;
  let response = {};

  try {
    response = await apiClient.post(url, { skillId: userSkill.skillId });
  } catch (error) {
    console.log(error);
    // TODO - handle error
  }

  return response.data;
}

/**
 * Creates a new skill.
 * !This only creates a skill. Does NOT attach the skill to any user
 * @param {Object} apiClient The api client
 * @param {Object} newSkill Details of the new skill
 */
async function createSkill(apiClient, newSkill) {
  const url = `${config.API_URL}/skills`;
  let response = {};

  try {
    response = await apiClient.post(url, newSkill);
  } catch (error) {
    console.log(error);
    // TODO - handle error
  }

  return response.data;
}

/**
 * Returns the availability of the user
 * Availability is an attribute on the user and thus
 * needs to be extracted from the user's profile
 * @param {Object} profile The user profile
 * @param {String} attributeName The attribute for which the value is requested
 */
export function getUserAttributeDetails(profile, attributeName) {
  if (!profile.attributes || profile.attributes.length === 0) {
    return {};
  }

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
export function getUserAchievements(profile) {
  const achievements = profile.achievements
    ? profile.achievements.map((a) => a.name)
    : [];

  return achievements;
}

/**
 * Returns the user's skills
 * @param {Object} profile The user profile
 */
export function getUserSkills(profile) {
  const skills = profile.skills
    ? profile.skills.map((a) => ({
        name: a.skill.name,
        id: a.skillId,
        externalId: a.skill.externalId,
        skillProviderId: a.skill.skillProviderId,
      }))
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

/**
 * Saves changes to a user's skill in the database
 * @param {Object} api The api client
 * @param {Object} param1 The details of the skill and user
 */
export async function updateUserSkills(api, { id, skills }) {
  let url;

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    if (skills[i].isDeleted) {
      url = `${config.API_URL}/users/${id}/skills/${skill.id}`;

      await api.delete(url);
    } else if (skills[i].isNew) {
      let userSkill;
      // We first check if the skill is already defined in the database, before we add it to the user
      // If not defined, we first define it, and then add it
      const existingSkill = await checkIfSkillExists(
        api,
        skill.skillProviderId,
        skill.externalId
      );

      if (existingSkill && existingSkill.length > 0) {
        userSkill = {
          userId: id,
          skillId: existingSkill.id,
        };
      } else {
        const newSkill = {
          name: skill.name,
          skillProviderId: skill.skillProviderId,
          externalId: skill.externalId,
        };

        const newCreatedSkill = await createSkill(api, newSkill);

        userSkill = {
          userId: id,
          skillId: newCreatedSkill.id,
        };
      }

      await addSkillToUser(api, userSkill);
    }
  }
}
