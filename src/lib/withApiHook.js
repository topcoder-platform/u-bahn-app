import React from "react";
import api from "../services/api";

export default function withApiHook(Component) {
  return function WrappedComponent(props) {
    const apiClient = api();

    return <Component {...props} api={apiClient} />;
  };
}
