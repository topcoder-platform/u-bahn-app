/**
 * Global application config.
 */

export default {
  API_URL: process.env.REACT_APP_API_URL,
  SEARCH_UI_API_URL: process.env.REACT_APP_SEARCH_UI_API_URL,

  BULK_UPLOAD_TEMPLATE_ID: process.env.REACT_APP_BULK_UPLOAD_TEMPLATE_ID,

  DEFAULT_SORT_ORDER: "name",
  ITEMS_PER_PAGE: 12,

  PRIMARY_ATTRIBUTES: {
    availability: "isAvailable",
    company: "company",
    location: "location",
    firstName: "firstName",
    lastName: "lastName",
    title: "title",
  },

  AUTH0: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENTID,
  },
};
