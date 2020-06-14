import config from "../config";

/**
 * Returns the groups for the logged in user
 * @param {Object} apiClient The api client
 * @param {Object} handle The logged in user's handle
 */
export async function getGroups(apiClient, handle) {
  let myGroups = [];
  let otherGroups = [];
  let response;

  // First, we get the userId of the current user
  try {
    response = await apiClient.get(`${config.API_URL}/users?handle=${handle}`);
  } catch (error) {
    console.log(error);
    // TODO - handle error
    return { myGroups, otherGroups };
  }

  if (!response.data || response.data.length !== 1) {
    alert(
      "Your user is not present in Ubahn. Cannot get your organization details, and thus the group details"
    );

    return { myGroups, otherGroups };
  }

  const userId = response.data[0].id;

  // Now, get my groups first
  try {
    response = await apiClient.get(
      `${config.GROUPS_API_URL}?universalUID=${userId}&membershipType=user`
    );
  } catch (error) {
    console.log(error);
    // TODO - handle error
    return { myGroups, otherGroups };
  }

  myGroups = response.data
    .filter((g) => g.status === "active")
    .map((g) => ({
      ...g,
      count: 0,
    }));

  // Get other groups next
  // These are groups that belong to the org of the logged in user
  // but the user is not a part of them

  // Get the org of the user
  try {
    response = await apiClient.get(
      `${config.API_URL}/users/${userId}/externalProfiles`
    );
  } catch (error) {
    console.log(error);
    // TODO - handle error
    return { myGroups, otherGroups };
  }

  if (!response.data || response.data.length !== 1) {
    alert("No organization (or multiple orgs) associated with your user");

    return { myGroups, otherGroups };
  }

  const organizationId = response.data[0].organizationId;

  // Fetch all groups in the org
  try {
    response = await apiClient.get(
      `${config.GROUPS_API_URL}?organizationId=${organizationId}`
    );
  } catch (error) {
    console.log(error);
    // TODO - handle error
    return { myGroups, otherGroups };
  }

  if (!response.data || response.data.length === 0) {
    return { myGroups, otherGroups };
  }

  otherGroups = response.data
    .filter((g) => g.status === "active")
    .filter((g) => {
      // Don't include groups part of my groups
      if (myGroups.findIndex((mygroup) => mygroup.id === g.id) === -1) {
        return true;
      }

      return false;
    })
    .map((g) => ({
      ...g,
      count: 0,
    }));

  return { myGroups, otherGroups };
}

/**
 * Adds the user to the group
 * @param {apiClient} apiClient The api client
 * @param {String} userId The user id
 * @param {Object} group The group to add to
 */
export async function addUserToGroup(apiClient, userId, group) {
  const url = `${config.GROUPS_API_URL}/${group.id}/members`;
  const payload = {
    universalUID: userId,
    membershipType: "user",
  };

  await apiClient.post(url, payload);
}

/**
 * Removes the user from the group
 * @param {Object} apiClient The api client
 * @param {String} userId The user id
 * @param {Object} group The group to remove from
 */
export async function removeUserFromGroup(apiClient, userId, group) {
  const url = `${config.GROUPS_API_URL}/${group.id}/members?universalUID=${userId}`;

  await apiClient.delete(url);
}

/**
 * Returns the members in the group
 * @param {Object} apiClient The api client
 * @param {String} groupId The group id under which we fetch the members
 */
export async function getMembersInGroup(apiClient, groupId) {
  const url = `${config.GROUPS_API_URL}/${groupId}/members`;

  return apiClient.get(url);
}
