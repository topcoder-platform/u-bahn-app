import config from "../../config";
import * as groupLib from "../../lib/groups";

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

  if (response.data) {
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
export function getUserPrimaryAttributeDetails(profile, attributeName) {
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
 * Returns the company attributes of the user
 * @param {Object} profile The user profile
 */
export function getUserCompanyAttributeDetails(profile) {
  let attributes = [];
  // These are also attributes, but they have a dedicated UI element to display them
  // Thus we omit them from the list of attributes we will be returning, which are
  // refered to as company attributes
  let primaryAttributeIds = [
    config.STANDARD_USER_ATTRIBUTES.location,
    config.STANDARD_USER_ATTRIBUTES.isAvailable,
    config.STANDARD_USER_ATTRIBUTES.title,
    config.STANDARD_USER_ATTRIBUTES.company,
  ];

  if (!profile.attributes || profile.attributes.length === 0) {
    return attributes;
  }

  attributes = profile.attributes
    .filter((attribute) => !primaryAttributeIds.includes(attribute.attributeId))
    .map((attribute) => ({
      id: attribute.attributeId,
      name: attribute.attribute.name,
      value: attribute.value,
    }));

  return attributes;
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
 * Returns the user's groups
 * @param {Object} profile The user profile
 */
export function getUserGroups(profile) {
  const groups = profile.groups ? profile.groups : [];

  return groups;
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
 * @param {Object} apiClient The api client
 * @param {Object} param1 The details of the skill and user
 */
export async function updateUserSkills(apiClient, { id, skills }) {
  let url;

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    if (skills[i].isDeleted) {
      url = `${config.API_URL}/users/${id}/skills/${skill.id}`;

      await apiClient.delete(url);
    } else if (skills[i].isNew) {
      let userSkill;
      // We first check if the skill is already defined in the database, before we add it to the user
      // If not defined, we first define it, and then add it
      const existingSkill = await checkIfSkillExists(
        apiClient,
        skill.skillProviderId,
        skill.externalId
      );

      if (existingSkill && existingSkill.length > 0) {
        userSkill = {
          userId: id,
          skillId: existingSkill[0].id,
        };
      } else {
        const newSkill = {
          name: skill.name,
          skillProviderId: skill.skillProviderId,
          externalId: skill.externalId,
        };

        const newCreatedSkill = await createSkill(apiClient, newSkill);

        userSkill = {
          userId: id,
          skillId: newCreatedSkill.id,
        };
      }

      await addSkillToUser(apiClient, userSkill);
    }
  }
}

/**
 * Adds / Removes groups to / from a user
 * @param {Object} apiClient The api client
 * @param {Object} user The user
 */
export async function updateUserGroups(apiClient, user) {
  for (let i = 0; i < user.groups.length; i++) {
    const group = user.groups[i];

    if (group.isNew) {
      try {
        await groupLib.addUserToGroup(apiClient, user.id, group);
      } catch (error) {
        console.log(error);
        // TODO - handle error
      }
    } else if (group.isDeleted) {
      try {
        await groupLib.removeUserFromGroup(apiClient, user.id, group);
      } catch (error) {
        console.log(error);
        // TODO - handle error
      }
    }
  }
}

/**
 * Updates the user attributes (the ones that are the company attributes)
 * @param {Object} apiClient The api client
 * @param {String} userId The user id
 * @param {Array} changedCompanyAttributes Array of attributes to update
 */
export async function updateUserCompanyAttributes(
  apiClient,
  userId,
  changedCompanyAttributes
) {
  for (let i = 0; i < changedCompanyAttributes.length; i++) {
    const attribute = changedCompanyAttributes[i];
    const url = `${config.API_URL}/users/${userId}/attributes/${attribute.id}`;

    try {
      await apiClient.patch(url, { value: attribute.value });
    } catch (error) {
      console.log(error);
      // TODO - handle error
    }
  }
}

/**
 * Updates the attribute of the user in the database
 * @param {Object} apiClient The api client
 * @param {Object} user The updated user
 * @param {String} attributeName The updated attribute
 */
export async function updateUserAttribute(apiClient, user, attributeName) {
  let payload = {};

  switch (attributeName) {
    case config.PRIMARY_ATTRIBUTES.availability:
      payload.userId = user.id;
      payload.attributeId = user.isAvailable.id;
      payload.value = user.isAvailable.value ? "true" : "false";
      break;
    case config.PRIMARY_ATTRIBUTES.title:
    case config.PRIMARY_ATTRIBUTES.company:
    case config.PRIMARY_ATTRIBUTES.location:
      payload.userId = user.id;
      payload.attributeId = user[attributeName].id;
      payload.value = user[attributeName].value;
      break;
    default:
      throw Error(`Unknown attribute name ${attributeName}`);
  }

  const url = `${config.API_URL}/users/${payload.userId}/attributes/${payload.attributeId}`;

  await apiClient.patch(url, { value: payload.value });
}

export async function updateUserInDb(
  apiClient,
  user,
  changedKeys,
  changedCompanyAttributes = []
) {
  const url = `${config.API_URL}/users/${user.id}`;
  let updatedName = false;
  let payload;

  for (let i = 0; i < changedKeys.length; i++) {
    switch (changedKeys[i]) {
      case config.PRIMARY_ATTRIBUTES.groups:
        try {
          await updateUserGroups(apiClient, user);
        } catch (error) {
          console.log(error);
          // TODO - Handle errors
        }

        break;
      case config.PRIMARY_ATTRIBUTES.skills:
        try {
          await updateUserSkills(apiClient, user);
        } catch (error) {
          console.log(error);
          // TODO - Handle errors
        }

        break;
      case config.PRIMARY_ATTRIBUTES.title:
      case config.PRIMARY_ATTRIBUTES.availability:
      case config.PRIMARY_ATTRIBUTES.company:
      case config.PRIMARY_ATTRIBUTES.location:
        try {
          await updateUserAttribute(apiClient, user, changedKeys[i]);
        } catch (error) {
          console.log(error);
          // TODO - Handle errors
        }

        break;
      case config.PRIMARY_ATTRIBUTES.firstName:
        // Combine updates to first and last name (since they are on the same model)
        if (!updatedName) {
          if (changedKeys.includes(config.PRIMARY_ATTRIBUTES.lastName)) {
            payload = {
              firstName: user.firstName,
              lastName: user.lastName,
            };
            updatedName = true;
          } else {
            payload = {
              firstName: user.firstName,
            };
          }

          try {
            await apiClient.patch(url, payload);
          } catch (error) {
            console.log(error);
            // TODO - handle errors
          }
        }

        break;
      case config.PRIMARY_ATTRIBUTES.lastName:
        // Combine updates to first and last name (since they are on the same model)
        if (!updatedName) {
          if (changedKeys.includes(config.PRIMARY_ATTRIBUTES.firstName)) {
            payload = {
              firstName: user.firstName,
              lastName: user.lastName,
            };
            updatedName = true;
          } else {
            payload = {
              lastName: user.lastName,
            };
          }

          try {
            await apiClient.patch(url, payload);
          } catch (error) {
            console.log(error);
            // TODO - handle errors
          }
        }

        break;
      case config.PRIMARY_ATTRIBUTES.companyAttributes:
        try {
          await updateUserCompanyAttributes(
            apiClient,
            user.id,
            changedCompanyAttributes
          );
        } catch (error) {
          console.log(error);
          // TODO - Handle errors
        }

        break;
      default:
        throw Error(`Unknown attribute ${changedKeys[i]}`);
    }
  }
}
