# U-Bahn user interface

This code base represents the user interface for the U-Bahn project.

## Local Deployment

Before you deploy, you need to configure the following in the application:

```text
REACT_APP_API_URL => The endpoint from which the application retrieves the users (and groups and most of the data) as well as to which the updates are pushed to

REACT_BULK_UPLOAD_TEMPLATE_ID => The id of the database record which is associated with the bulk upload template file. You would need to query the backend to get the id and then set it against this variable

REACT_APP_ATTRIBUTE_ID_LOCATION
REACT_APP_ATTRIBUTE_ID_COMPANY
REACT_APP_ATTRIBUTE_ID_TITLE
REACT_APP_ATTRIBUTE_ID_ISAVAILABLE
  => All 4 of the above are the ids of the attributes with name "location", "company", "title" and "isAvailable" respectively. These are used to filter attributes for display under a dedicated section named company attributes. Since these already have UI elements of their own, they are filtered from the list of company attributes
REACT_APP_ACCOUNTS_APP_CONNECTOR
REACT_APP_TC_AUTH_URL
  => The connection parameters to authenticate with Topcoder
REACT_APP_APP_URL
  => The app's url. ex. http://localhost:3000. This is used to redirect the user after they have logged in
REACT_APP_AUTH0_CLAIMS_HANDLE
  => The property name in decoded token object to read the nickname from
REACT_APP_TC_COOKIE_NAME
  => The topcoder cookie name. App uses this to detect if the user has token or not
```

You can create a `.env.local` file and provide the above configuration. Note that there's more configuration that you can change and you can find this under `src/config.js`. The above configurations are the minimum ones, that you need to launch the app successfully.

Once the configuration is set, you can proceed to deploy

The code base has been setup using [Create React App](https://github.com/facebook/create-react-app). Thus, to start the application locally, you need to first (and only once) run the following command:

```bash
$ npm install
// Will install the dependenceis
```

followed by:

```bash
$ npm start
// Will start the application at http://localhost:3000
```
