/**
 * Reference: https://github.com/auth0-samples/auth0-react-samples/issues/163#issuecomment-544764137
 */

import { useRef, useEffect } from "react";
import axios from "axios";

import { useAuth0 } from "../react-auth0-spa";

export default () => {
  const { getTokenSilently, loginWithRedirect } = useAuth0();
  const api = useRef(
    axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
  useEffect(() => {
    const currentAPI = api.current;
    currentAPI.interceptors.request.use(async (config) => {
      let token;
      if (process.env.REACT_APP_DEV_TOKEN) {
        token = process.env.REACT_APP_DEV_TOKEN;
      } else {
        token = await getTokenSilently();
      }
      config.headers.authorization = `Bearer ${token}`;
      config.cancelToken = axios.CancelToken.source().token;
      return config;
    });
    currentAPI.interceptors.response.use(null, async (error) => {
      if (error.config && error.response && error.response.status === 403) {
        await loginWithRedirect({
          redirect_uri: window.location.origin,
        });
      }

      return Promise.reject(error);
    });
  });
  return api.current;
};
