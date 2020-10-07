/**
 * Routing of application pages.
 */

import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import {
  configureConnector,
  getFreshToken,
} from "@topcoder-platform/tc-auth-lib";

import Error404 from "./pages/Error404";
import SearchPage from "./pages/Search";

import history from "./lib/history";
import loader from "./assets/images/loading.svg";
import config from "./config";

configureConnector({
  connectorUrl: config.AUTH.ACCOUNTS_APP_CONNECTOR,
  frameId: "tc-accounts-iframe",
});

export default function AppRouter() {
  const [loading, setLoading] = React.useState(true);

  /**
   * The auth checks would ideally be under Private Routes
   * However, our app does not have any routes (only / route)
   * and thus adding the code on the ROOT route itself...
   */
  React.useEffect(() => {
    if (!loading) {
      return;
    }

    (async () => {
      try {
        await getFreshToken();

        setLoading(false);
      } catch (error) {
        console.log("Error in router");
        console.log(error);
        let url = `retUrl=${encodeURIComponent(config.AUTH.APP_URL)}`;
        url = `${config.AUTH.TC_AUTH_URL}?${url}`;
        window.location.href = url;
      }
    })();
  }, [loading]);

  if (loading) {
    return (
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "white",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <img
          style={{ height: "120px", width: "120px" }}
          src={loader}
          alt="Loading"
        />
      </div>
    );
  }

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={SearchPage} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
}
