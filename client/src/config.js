/**
 * Global application config.
 */

export default {
  API_URL: process.env.REACT_APP_API_URL,
  API_PREFIX: process.env.REACT_APP_API_PREFIX,
  GROUPS_API_URL: process.env.REACT_APP_GROUPS_API_URL,

  BULK_UPLOAD_TEMPLATE_ID: process.env.REACT_APP_BULK_UPLOAD_TEMPLATE_ID,
  EMSI_SKILLPROVIDER_ID: process.env.REACT_APP_EMSI_SKILLPROVIDER_ID,

  DEFAULT_SORT_ORDER: "name",
  ITEMS_PER_PAGE: 12,

  PRIMARY_ATTRIBUTES: {
    availability: "isAvailable",
    company: "company",
    location: "location",
    firstName: "firstName",
    lastName: "lastName",
    title: "title",
    skills: "skills",
    groups: "groups",
    companyAttributes: "companyAttributes",
  },

  STANDARD_USER_ATTRIBUTES: {
    location: process.env.REACT_APP_ATTRIBUTE_ID_LOCATION,
    company: process.env.REACT_APP_ATTRIBUTE_ID_COMPANY,
    title: process.env.REACT_APP_ATTRIBUTE_ID_TITLE,
    isAvailable: process.env.REACT_APP_ATTRIBUTE_ID_ISAVAILABLE,
  },

  AUTH0: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENTID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  },
};
