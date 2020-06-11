import config from "../../config";

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
  const url = `${config.API_URL}/search/users`;
  const params = new URLSearchParams();
  const searchPayload = {};

  // Pagination params
  params.append("page", page.toString());
  params.append("perPage", limit.toString());

  if (criteria.locations) {
    searchPayload.locations = criteria.locations;
  }

  if (criteria.skills) {
    searchPayload.skills = criteria.skills;
  }

  if (criteria.achievements) {
    searchPayload.achievements = criteria.achievements;
  }

  if (criteria.hasOwnProperty("isAvailable")) {
    searchPayload.isAvailable = criteria.isAvailable.toString();
  }

  if (orderBy) {
    params.append("orderBy", orderBy);
  } else {
    params.append("orderBy", config.DEFAULT_SORT_ORDER);
  }

  return { url, options: { params }, body: searchPayload };
}
