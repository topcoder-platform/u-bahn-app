# U-Bahn user interface

This code base represents the user interface for the U-Bahn project.

## Local Deployment

Before you deploy, you need to configure the following in the application:

```text
REACT_APP_API_URL => The endpoint from which the application retrieves the users (and groups and most of the data) as well as to which the updates are pushed to

REACT_APP_SEARCH_UI_API_URL => The endpoint from which the user can download the bulk upload template files as well as upload the bulk user upload file to

REACT_BULK_UPLOAD_TEMPLATE_ID => The id of the database record which is associated with the bulk upload template file. You would need to query the endpoint under REACT_APP_SEARCH_UI_API_URL to get the id and then set it against this variable

REACT_APP_EMSI_SKILLPROVIDER_ID => The skill provider id with name 'EMSI'. Denotes that the skills with an externalId are using EMSI as the skill provider.

REACT_APP_ATTRIBUTE_ID_LOCATION
REACT_APP_ATTRIBUTE_ID_COMPANY
REACT_APP_ATTRIBUTE_ID_TITLE
REACT_APP_ATTRIBUTE_ID_ISAVAILABLE
  => All 4 of the above are the ids of the attributes with name "location", "company", "title" and "isAvailable" respectively. These are used to filter attributes for display under a dedicated section named company attributes. Since these already have UI elements of their own, they are filtered from the list of company attributes
REACT_APP_AUTH0_DOMAIN => The Auth0 login domain

REACT_APP_AUTH0_CLIENTID => The Auth0 clientId
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
