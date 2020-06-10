import config from "../../config";

/**
 * Returns the groups for the user
 * @param {Object} apiClient The api client
 * @param {Object} handle The logged in user's handle
 */
export async function getGroups(apiClient, handle) {
  let myGroups = [];
  let otherGroups = [];
  let response;
  // Get my groups first
  try {
    response = await apiClient.get(config.GROUPS_API_URL);
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
    alert("No organization associated with your user");

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

  if (!response.data || response.data.length !== 1) {
    alert(
      "The organization associated with your user does not exist in groups"
    );

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
 * Prepares the search query and url
 * @param {Object} param0 The search parameters
 */
export function getSearchUsersRequestDetails({
  search,
  groupId,
  page,
  limit,
  criteria,
  orderBy,
} = {}) {
  const url = `${config.API_URL}/users`;
  const params = new URLSearchParams();

  // We need to get all details about the user
  params.append("enrich", "true");

  // Pagination params
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (criteria.locations) {
    criteria.locations.forEach((location) =>
      params.append("location", location)
    );
  }

  if (criteria.skills) {
    criteria.skills.forEach((location) => params.append("skill", location));
  }

  if (criteria.achievements) {
    criteria.achievements.forEach((location) =>
      params.append("achievement", location)
    );
  }

  if (criteria.hasOwnProperty("isAvailable")) {
    params.append("isAvailable", criteria.isAvailable.toString());
  }

  if (orderBy) {
    params.append("orderBy", orderBy);
  } else {
    params.append("orderBy", config.DEFAULT_SORT_ORDER);
  }

  return { url, options: { params } };
}
