import defaultOrgLogoUrl from "../assets/images/u-bahn-logo.svg";

const mocks = {
  groups: [
    "C++ Developers",
    "Java Developers",
    "AWS Experts",
    "South East Regios",
    "Topcoder Members",
    "Adrenaline junkies",
    "Midninght programmers",
    "Work hard & play hard group",
  ],
};

mocks.groups.sort();

/**
 * Creates a new group.
 * @param {string} group
 * @return {Promise}
 */
function createGroup(group) {
  // TODO: Not supported by the mock API at the moment.
  if (group && !this.mocks.groups.includes(group)) {
    this.mocks.groups.push(group);
    this.mocks.groups.sort();
  }
}

/**
 * Gets groups from API.
 * @param {string} [filter] Optional. Group filter.
 * @return {Promise<string[]>} Resolves to group array.
 */
async function getGroups(filter) {
  /* TODO: /groups endpoint does not seem to exist in the provided mock APIs,
   * thus for now this method is a simple mock-up. */
  let groups = [...this.mocks.groups];
  if (filter) {
    const f = filter.toLocaleLowerCase();
    groups = groups.filter((g) => g.toLocaleLowerCase().includes(f));
  }
  return groups;
}

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

async function getSkills() {
  const mockSkillsTags = [
    { name: ".Net" },
    { name: "API" },
    { name: "C++" },
    { name: "React" },
    { name: "Jekyll" },
    { name: "Python" },
    { name: "PHP" },
    { name: "Rust" },
    { name: "Angular" },
    { name: "Java" },
    { name: "Vue" },
    { name: "Gatsby" },
    { name: "Swift" },
    { name: "C#" },
    { name: "Javascript" },
    { name: "Node" },
    { name: "AWS" },
    { name: "Unity" },
  ];

  return mockSkillsTags;
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
  createGroup,
  getGroups,
  getOrganization,
  getLocations,
  getSkills,
  getAchievements,
};
