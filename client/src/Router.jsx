/**
 * Routing of application pages.
 */

import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import Error404 from "./pages/Error404";
import SearchPage from "./pages/Search";

import { useAuth0 } from "./react-auth0-spa";
import history from "./lib/history";
import loader from "./assets/images/loading.svg";

export default function AppRouter() {
  const { loading } = useAuth0();

  if (loading) {
    return (
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "white",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <img style={{marginTop: "19%", height: "120px", width: "120px" }} src={loader} alt="Loading" />
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
