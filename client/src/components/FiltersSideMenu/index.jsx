import React from "react";
import PT from "prop-types";

import style from "./style.module.scss";
import SearchTabFilters from "./filters";

export default function FiltersSideMenu({ locations, achievements }) {
  return (
    <div className={style.container}>
      <SearchTabFilters locations={locations} achievements={achievements} />
    </div>
  );
}

FiltersSideMenu.propTypes = {
  locations: PT.array.isRequired,
  achievements: PT.array.isRequired,
};
