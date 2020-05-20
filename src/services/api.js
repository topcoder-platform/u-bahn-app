/**
 * Encapsulates API communication.
 */

import axios from 'axios';
import config from '../config';

import defaultOrgLogoUrl from '../assets/images/u-bahn-logo.svg';

export default class Api {
  /**
   * Creates a new Api instance.
   * @param {string} [token] Optional. The authentication token to use with API
   *  requests.
   */
  constructor({ token }) {
    this.api = axios.create();
    if (token) this.api.defaults.headers.common.Authorization = token;

    this.mocks = {
      groups: [
        'C++ Developers',
        'Java Developers',
        'AWS Experts',
        'South East Regios',
        'Topcoder Members',
        'Adrenaline junkies',
        'Midninght programmers',
        'Work hard & play hard group',
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
      groups = groups.filter(g => g.toLocaleLowerCase().includes(f));
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
    const url = `${config.UI_API_BASE}/templates/${templateId}`;
    const { data } = await axios(url);
    return data;
  }

  /**
   * Gets the specified 
   * @param {string} userId 
   * @return {Promise<object>} Resolves to user object.
   */
  async getUser(userId) {
    const { data } = await this.api(`${config.SEARCH_API_BASE}/users/${userId}`);

    return data;
  }

  /**
   * Looks up users.
   * @param {string} [search] Optional. Search query
   * @param {string} [groupId] Optional. Group filter.
   * @param {string} [roleId] Optional. Role filter.
   * @return {Promise<object[]>} Resolves to user object array.
   */
  async getUsers({ search, groupId, roleId, page, limit } = {}) {
    let { headers, data } = await this.api(`${config.SEARCH_API_BASE}/users`, {
      params: { search, groupId, roleId, page, limit},
    });

    const total = headers['x-total-count'] || 0;

    return { total, data };
  }

  /**
   * Stores updated user object into API.
   * @param {object} user
   * @return {Promise<object>} Resolves to the resulting user object.
   */
  async updateUser(user) {
    /* TODO: The actual API call should be here to update this user, but as
     * the mock API is not very useful, no call for now. */
    return {...user};
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
    const res = await axios.post(`${config.UI_API_BASE}/uploads`, data, {
      cancelToken: options.cancelToken,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onUploadProgress,
    });
    return res.data;
  }
}
