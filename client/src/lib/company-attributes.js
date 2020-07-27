// FIRST - import config from the file under src/config
import config from "../config";
import * as OrgService from "../services/user-org";
import Axios from "axios";

let primaryAttributeIds = [
  config.STANDARD_USER_ATTRIBUTES.location,
  config.STANDARD_USER_ATTRIBUTES.isAvailable,
  config.STANDARD_USER_ATTRIBUTES.title,
  config.STANDARD_USER_ATTRIBUTES.company,
];

/**
 * Get the attributes associated with the company (organization)
 * @param {Object} apiClient The api client (you can get this from src/services/api and then call api() to get the apiClient)
 */
export async function getCompanyAttributes(apiClient, cancelToken) {
  let response;
  let attributeGroups;
  let attributes = [];
  let errorMessage =
    "An error occurred when getting company attributes for the custom filter";
  const organizationId = OrgService.getSingleOrg();

  // Get the attribute groups under the org
  let url = `${config.API_URL}/attributeGroups?organizationId=${organizationId}`;

  try {
    response = await apiClient.get(url, { cancelToken });
  } catch (error) {
    if (Axios.isCancel(error)) {
      return undefined;
    }
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
      response = await apiClient.get(url, { cancelToken });
    } catch (error) {
      if (Axios.isCancel(error)) {
        return undefined;
      }
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
    if (primaryAttributeIds.includes(attribute.name)) {
      return false;
    }

    return true;
  });

  return attributes;
}
