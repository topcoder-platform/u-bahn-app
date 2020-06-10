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
