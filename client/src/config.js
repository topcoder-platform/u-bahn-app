/**
 * Global application config.
 */

export default {
  API_URL: process.env.REACT_APP_API_URL,
  API_PREFIX: process.env.REACT_APP_API_PREFIX,
  GROUPS_API_URL: process.env.REACT_APP_GROUPS_API_URL,
  GROUPS_PER_PAGE: process.env.REACT_APP_GROUPS_PER_PAGE || 1000,

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

  AUTH: {
    ACCOUNTS_APP_CONNECTOR: process.env.REACT_APP_ACCOUNTS_APP_CONNECTOR,
    TC_AUTH_URL: process.env.REACT_APP_TC_AUTH_URL,
    // redirect to url after login
    APP_URL: process.env.REACT_APP_APP_URL,
    // property name in decoded token object to read the nickname from
    handleClaims: process.env.REACT_APP_AUTH0_CLAIMS_HANDLE,
    // cookie name which contains the TC token
    cookieName: process.env.REACT_APP_TC_COOKIE_NAME || "v3jwt",
  },
};
