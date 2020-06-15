import defaultOrgLogoUrl from "../assets/images/u-bahn-logo.svg";

/**
 * Gets organization meta data.
 * @param {string} organizationId
 * @return {Promise<object>}
 */
async function getOrganization(organizationId) {
  // TODO: The API call should happen here. Mock for now.
  return {
    logoUrl: defaultOrgLogoUrl,
  };
}

async function getLocations() {
  const mockLocationTags = [
    { name: "New York" },
    { name: "Tokyo" },
    { name: "Katarinaborough" },
    { name: "Paris" },
    { name: "London" },
    { name: "Sofia" },
    { name: "Prague" },
    { name: "San Francisco" },
    { name: "Miami" },
    { name: "Bangalore" },
    { name: "Amsterdam" },
    { name: "Colombo" },
    { name: "Melbourne" },
  ];
  return mockLocationTags;
}

async function getAchievements() {
  const mockAchievementsTags = [
    { name: "Informatika" },
    { name: "Upwork" },
    { name: "TopCoder" },
  ];

  return mockAchievementsTags;
}

export default {
  getOrganization,
  getLocations,
  getAchievements,
};
