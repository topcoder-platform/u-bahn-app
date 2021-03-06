/**
 * Reference: https://github.com/auth0-samples/auth0-react-samples/issues/163#issuecomment-544764137
 */

import { useRef, useEffect } from "react";
import axios from "axios";
import { getFreshToken } from "@topcoder-platform/tc-auth-lib";

import config from "../config";

function forceLogin() {
  let url = `retUrl=${encodeURIComponent(config.AUTH.APP_URL)}`;
  url = `${config.AUTH.TC_AUTH_URL}?${url}`;
  window.location.href = url;
}

export default () => {
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
        token = await getFreshToken();
      }
      config.headers.authorization = `Bearer ${token}`;
      return config;
    });
    currentAPI.interceptors.response.use(null, async (error) => {
      if (error.config && error.response && error.response.status === 403) {
        console.log("Inside api. Request failed with 403. Forcing login");
        forceLogin();
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const modError = new Error(error.response.data.message);
        return Promise.reject(modError);
      }

      return Promise.reject(error);
    });
  });
  return api.current;
};
