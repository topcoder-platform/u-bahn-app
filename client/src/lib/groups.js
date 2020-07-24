import config from "../config";
import * as OrgService from "../services/user-org";
import Axios from "axios";

/**
 * Returns the groups for the logged in user
 * @param {Object} apiClient The api client
 * @param {Object} handle The logged in user's handle
 */
export async function getGroups(apiClient, handle, cancelToken) {
  let myGroups = [];
  let otherGroups = [];
  let response;

  // First, we get the userId of the current user
  try {
    response = await apiClient.get(`${config.API_URL}/users?handle=${handle}`, {
      cancelToken,
    });
  } catch (error) {
    console.log(error);
    if (Axios.isCancel(error)) {
      return undefined;
    }
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
      `${config.GROUPS_API_URL}?universalUID=${userId}&membershipType=user`,
      { cancelToken }
    );
  } catch (error) {
    console.log(error);
    if (Axios.isCancel(error)) {
      return undefined;
    }
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
  const organizationId = OrgService.getSingleOrg();

  // Fetch all groups in the org
  try {
    response = await apiClient.get(
      `${config.GROUPS_API_URL}?organizationId=${organizationId}`,
      { cancelToken }
    );
  } catch (error) {
    console.log(error);
    if (Axios.isCancel(error)) {
      return undefined;
    }
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

  // Now, get member counts
  try {
    response = await apiClient.get(
      `${config.GROUPS_API_URL}/memberGroups/groupMembersCount?universalUID=${userId}`,
      { cancelToken }
    );
  } catch (error) {
    console.log(error);
    if (Axios.isCancel(error)) {
      return undefined;
    }
    // TODO - handle error
    return { myGroups, otherGroups };
  }

  myGroups.forEach((m, i, arr) => {
    response.data.forEach((c) => {
      if (c.id === m.id) {
        arr[i].count = c.count;
      }
    });
  });

  // Fetch all groups in the org
  try {
    response = await apiClient.get(
      `${config.GROUPS_API_URL}/memberGroups/groupMembersCount?organizationId=${organizationId}`,
      { cancelToken }
    );
  } catch (error) {
    console.log(error);
    if (Axios.isCancel(error)) {
      return undefined;
    }
    // TODO - handle error
    return { myGroups, otherGroups };
  }

  otherGroups.forEach((o, i, arr) => {
    response.data.forEach((c) => {
      if (c.id === o.id) {
        arr[i].count = c.count;
      }
    });
  });

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
export async function getMembersInGroup(apiClient, groupId, page, perPage) {
  const url = `${config.GROUPS_API_URL}/${groupId}/members`;

  return apiClient.get(url, {
    params: {
      page,
      perPage,
    },
  });
}

/**
 * Creates a group under the user's org
 * @param {Object} apiClient The api client
 * @param {String} groupName The name (and description) of the group
 */
export async function createGroup(apiClient, groupName) {
  let response;
  const organizationId = OrgService.getSingleOrg();

  const payload = {
    name: groupName,
    description: groupName,
    privateGroup: true,
    selfRegister: false,
    domain: "topcoder",
    organizationId,
  };

  try {
    response = await apiClient.post(`${config.GROUPS_API_URL}`, payload);
    return response.data;
  } catch (error) {
    if (error && error.message) {
      return { message: error.message };
    }
    // TODO - Handle error
  }
}
