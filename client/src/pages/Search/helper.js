import config from "../../config";
import { getSingleOrg } from "../../services/user-org";

/**
 * Prepares the search query and url
 * @param {Object} param0 The search parameters
 */
export function getSearchUsersRequestDetails({
  keyword,
  page,
  limit,
  criteria,
  orderBy,
} = {}) {
  const url = `${config.API_URL}/skill-search/users`;
  const params = new URLSearchParams();
  const searchPayload = {};

  // Pagination params
  params.append("page", page.toString());
  params.append("perPage", limit.toString());

  if (keyword) {
    searchPayload.keyword = keyword;
  }

  if (criteria.locations) {
    searchPayload.locations = criteria.locations;
  }

  if (criteria.skills) {
    searchPayload.skills = criteria.skills.map((s) => s.name);
  }

  if (criteria.achievements) {
    searchPayload.achievements = criteria.achievements;
  }

  if (criteria.hasOwnProperty("isAvailable")) {
    searchPayload.isAvailable = criteria.isAvailable.toString();
  }

  if (criteria.attributes && criteria.attributes.length > 0) {
    searchPayload.attributes = criteria.attributes;
  }

  // Restrict by org
  searchPayload.organizationId = getSingleOrg();

  if (orderBy) {
    params.append("orderBy", orderBy);
  } else {
    params.append("orderBy", config.DEFAULT_SORT_ORDER);
  }

  return { url, options: { params }, body: searchPayload };
}
