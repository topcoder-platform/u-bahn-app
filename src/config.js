/**
 * Global application config.
 */

export default {
  UI_API_BASE: process.env.UI_API_BASE
    || 'https://u-bahn-search-ui-api-dev.herokuapp.com/api',
  V5_API_BASE: process.env.V5_API_BASE
    || 'https://ubahn-api-dev.herokuapp.com/v5',
};
