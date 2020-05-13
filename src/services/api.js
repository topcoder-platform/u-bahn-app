/**
 * Encapsulates API communication.
 */

import axios from 'axios';
import config from '../config';

import defaultOrgLogoUrl from '../assets/images/u-bahn-logo.svg';

const MOCK_NAMES = [
  'Angel Mccoy',
  'John Doe',
  'Saint Patric',
  'Mad Max',
  'Alexander Great',
  'Julius Ceasar',
  'Bill Gates',
  'Dunkan McLaud',
  'Max Zukerberg',
  'Tom Jones',
  'Rolling Stone',
  'Freddy Mercury',
  'Santa Claus',
];

/**
 * Creates a mock user object.
 *
 * TODO: This is a temporary function to rely upon until some data are loaded
 * into the API mock.
 *
 * @return {object}
 */
function newMockUser() {
  return {
    id: (++newMockUser.id).toString(),
    handle: 'mcangel',
    name: MOCK_NAMES[newMockUser.id % MOCK_NAMES.length],
    role: 'Front-end Developer',
    company: 'U-Bahn Internet Services',
    location: 'New York, US',
    skills: ['.Net', 'API', 'C++'],
    achievements: [
      'Rocks',
      'Rolls',
    ],
    attributes: {
      key1: 'Value 1',
      key2: 'Value 2',
    },
    groups: ['Group 1', 'Group 2'],
    available: false,
  };
}
newMockUser.id = 0;

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
    const { data } = await this.api(`${config.V5_API_BASE}/users/${userId}`);

    /* TODO: As of now the mock API returns empty results for any user, thus
     * we mock the mock API response, returning some default user object here. 
     * Also the docs do not seem contain the full schema of user objects, thus
     * the mock response here is based on what is drawn in the UI design.
     */
    return data || newMockUser();
  }

  /**
   * Looks up users.
   * @param {string} [groupId] Optional. Group filter.
   * @param {string} [handle] Optional. User handle filter.
   * @param {string} [roleId] Optional. Role filter.
   * @return {Promise<object[]>} Resolves to user object array.
   */
  async getUsers({ groupId, handle, roleId } = {}) {
    let { data } = await this.api(`${config.V5_API_BASE}/users`, {
      params: { groupId, handle, roleId},
    });

    /* TODO: As of now the mock API returns empty strings instead of user
     * objects, thus the following piece of code replaces them by mock objects
     * at the frontend side to allow moving forward with the frontend
     * development. */
    data = data.map((user) => user || newMockUser());
    while (data.length < 20) data.push(newMockUser());

    return data;
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
