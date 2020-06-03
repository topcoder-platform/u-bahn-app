/**
 * Encapsulates API communication.
 */

import axios from "axios";
import config from "../config";

import defaultOrgLogoUrl from "../assets/images/u-bahn-logo.svg";

export default class Api {
  /**
   * Creates a new Api instance.
   * @param {string} [token] Optional. The authentication token to use with API
   *  requests.
   */
  constructor({ token }) {
    this.api = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (token) this.api.defaults.headers.common.Authorization = token;

    this.mocks = {
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
    this.mocks.groups.sort();
  }

  /**
   * Creates a new group.
   * @param {string} group
   * @return {Promise}
   */
  async createGroup(group) {
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
  async getGroups(filter) {
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
  async getOrganization(organizationId) {
    // TODO: The API call should happen here. Mock for now.
    return {
      logoUrl: defaultOrgLogoUrl,
    };
  }

  /**
   * Downloads profile import template.
   * @param {string} templateId
   * @return {Promise<object>} Template meta object.
   */
  async getTemplate(templateId) {
    const url = `${config.SEARCH_UI_API_URL}/templates/${templateId}`;
    const { data } = await axios(url);
    return data;
  }

  /**
   * Gets the specified
   * @param {string} userId
   * @return {Promise<object>} Resolves to user object.
   */
  async getUser(userId) {
    const { data } = await this.api(`${config.API_URL}/users/${userId}`);

    return data;
  }

  /**
   * Looks up users.
   * @param {string} [search] Optional. Search query
   * @param {string} [groupId] Optional. Group filter.
   * @param {string} [roleId] Optional. Role filter.
   * @return {Promise<object[]>} Resolves to user object array.
   */
  async getUsers({
    search,
    groupId,
    roleId,
    page,
    limit,
    criteria,
    sortBy,
  } = {}) {
    let { headers, data } = await this.api(`${config.API_URL}/users`, {
      params: {
        search,
        groupId,
        roleId,
        page,
        limit,
        criteria,
        sortBy,
        enrich: true,
      },
    });

    const total = headers["x-total"] || 0;

    return { total, data };
  }

  /**
   * Stores updated user object into API.
   * @param {object} user
   * @return {Promise<object>} Resolves to the resulting user object.
   */
  async updateUser(user) {
    const entity = { ...user };
    delete entity.id;

    let data;

    try {
      const response = await this.api.patch(
        `${config.API_URL}/users/${user.id}`,
        entity
      );
      data = response.data;
    } catch (error) {
      // TODO - What should happen when update fails?
      const mockData = { ...user };
      data = mockData;
    }

    return data;
  }

  /**
   * Uploads profiles to import.
   * @param {FormData} data Payload to upload.
   * @param {object} [options]
   * @param {function} [options.onUploadProgress] Optional. Upload progress
   *  callback.
   * @param {CancelToken} [options.cancelToken] Optional. Cancel token from
   *  axios.
   * @return {Promise<object>} Resolves to the API response payload.
   */
  async upload(data, options = {}) {
    const res = await axios.post(`${config.SEARCH_UI_API_URL}/uploads`, data, {
      cancelToken: options.cancelToken,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: options.onUploadProgress,
    });
    return res.data;
  }

  async getLocations() {
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

  async getSkills() {
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

  async getAchievements() {
    const mockAchievementsTags = [
      { name: "Informatika" },
      { name: "Upwork" },
      { name: "TopCoder" },
    ];

    return mockAchievementsTags;
  }

  async getMyGroups() {
    return [
      { name: "Group 1", count: 42 },
      { name: "Group 2", count: 42 },
      { name: "Group 3", count: 42 },
    ];
  }

  async getOtherGroups() {
    return [
      { name: "C++ Developers", count: 42 },
      { name: "Java Developers", count: 42 },
      { name: "AWS Experts", count: 42 },
      { name: "South East Region", count: 42 },
    ];
  }
}
