import config from "../config";
import * as OrgService from "../services/user-org";

/**
 * Returns achivement suggestions based on query
 * @param {Object} apiClient  The api client (you can get this from src/services/api and then call api() to get the apiClient)
 * @param {String} query query to search for
 */
export async function getAchievements(apiClient, query) {
  let response;
  const organizationId = OrgService.getSingleOrg();
  let url = `${config.API_URL}/search/userAchievements?organizationId=${organizationId}&keyword=${query}`;

  try {
    response = await apiClient.get(url);
  } catch (error) {
    console.log(error);
    return [];
  }

  if (!response.data || response.data.length < 1) {
    return [];
  }

  return response.data;
}
