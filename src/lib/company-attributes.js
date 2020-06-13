// FIRST - import config from the file under src/config
import config from "../config";

let primaryAttributeIds = [
  config.STANDARD_USER_ATTRIBUTES.location,
  config.STANDARD_USER_ATTRIBUTES.isAvailable,
  config.STANDARD_USER_ATTRIBUTES.title,
  config.STANDARD_USER_ATTRIBUTES.company,
];

/**
 * Get the attributes associated with the company (organization)
 * @param {Object} apiClient The api client (you can get this from src/services/api and then call api() to get the apiClient)
 * @param {Object} user The user associated with the company (You can use the user that is returned by src/react-auth0-spa)
 */
export async function getCompanyAttributes(apiClient, user) {
  let response;
  let userId;
  let organizationId;
  let attributeGroups;
  let attributes = [];
  let errorMessage =
    "An error occurred when getting company attributes for the custom filter";
  // First get the user id in ubahn
  let url = `${config.API_URL}/users?handle=${user.nickname}`;

  try {
    response = await apiClient.get(url);
  } catch (error) {
    console.log(error);
    alert(errorMessage);
    // TODO - handle error
    return attributes;
  }

  if (!response.data || response.data.length !== 1) {
    alert(errorMessage);
    return attributes;
  }

  userId = response.data[0].id;

  // Now get the org associated with the user
  url = `${config.API_URL}/users/${userId}/externalProfiles`;

  try {
    response = await apiClient.get(url);
  } catch (error) {
    console.log(error);
    alert(errorMessage);
    // TODO - handle error
    return attributes;
  }

  if (!response.data || response.data.length !== 1) {
    alert(errorMessage);
    return attributes;
  }

  organizationId = response.data[0].organizationId;

  // Now we get the attribute groups under the org
  url = `${config.API_URL}/attributeGroups?organizationId=${organizationId}`;

  try {
    response = await apiClient.get(url);
  } catch (error) {
    console.log(error);
    alert(errorMessage);
    // TODO - handle error
    return attributes;
  }

  if (!response.data || response.data.length < 1) {
    alert(errorMessage);
    return attributes;
  }

  attributeGroups = response.data;

  // Now, for each attribute group, we will proceed to get the attributes
  for (let i = 0; i < attributeGroups.length; i++) {
    url = `${config.API_URL}/attributes?attributeGroupId=${attributeGroups[0].id}`;

    try {
      response = await apiClient.get(url);
    } catch (error) {
      console.log(error);
      alert(errorMessage);
      // TODO - handle error
      return attributes;
    }

    if (!response.data) {
      alert(errorMessage);
      return attributes;
    }

    if (response.data.length > 0) {
      attributes = attributes.concat(response.data);
    }
  }

  // Finally, we only need the company attributes
  attributes = attributes.filter((attribute) => {
    if (primaryAttributeIds.includes(attribute.id)) {
      return false;
    }

    return true;
  });

  return attributes;
}
