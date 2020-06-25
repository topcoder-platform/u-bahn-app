import config from "../config";
import _ from "lodash";

const ORGANIZATIONID_KEY = "organizationId";

/**
 * Returns the org of the user
 * @param {Object} apiClient The api client
 * @param {String} handle The user's handle
 */
export async function getOrg(apiClient, handle) {
  let response;
  let organizationIds = [];
  let organizations = [];
  let errorMessage =
    "An error occurred when getting the organization associated with your user";

  // First check the session storage
  let organization = sessionStorage.getItem(ORGANIZATIONID_KEY);

  if (organization) {
    return [JSON.parse(organization)];
  }

  // Call the api(s) to get the user's org
  let url = `${config.API_URL}/users?handle=${handle}`;

  try {
    response = await apiClient.get(url);
  } catch (error) {
    console.log(error);
    alert(errorMessage);
    return;
  }

  if (!response.data || response.data.length !== 1) {
    alert(errorMessage);
    return;
  }

  const userId = response.data[0].id;

  // Now get the org(s) associated with the user
  url = `${config.API_URL}/users/${userId}/externalProfiles`;

  try {
    response = await apiClient.get(url);
  } catch (error) {
    console.log(error);
    alert(errorMessage);
    return;
  }

  if (!response.data) {
    alert(errorMessage);
    return;
  }

  organizationIds = response.data.map((o) => o.organizationId);

  // Get the org names
  for (let i = 0; i < organizationIds.length; i++) {
    url = `${config.API_URL}/organizations/${organizationIds[i]}`;

    try {
      response = await apiClient.get(url);
    } catch (error) {
      console.log(error);
      alert(errorMessage);
      return;
    }

    organizations.push(_.pick(response.data, ["id", "name"]));
  }

  return organizations;
}

/**
 * Throws error if there's no single org set, else returns it
 */
export function getSingleOrg() {
  const organization = sessionStorage.getItem(ORGANIZATIONID_KEY);

  if (!organization) {
    throw Error("No organization found");
  } else if (!JSON.parse(organization).id) {
    throw Error("No organization found");
  }

  return JSON.parse(organization).id;
}

/**
 * Sets one organization id into session storage
 * @param {String} organization The organization
 */
export function setSingleOrg(organization) {
  sessionStorage.setItem(ORGANIZATIONID_KEY, JSON.stringify(organization));
}

export function clearOrg(organization) {
  sessionStorage.removeItem(ORGANIZATIONID_KEY);
}
