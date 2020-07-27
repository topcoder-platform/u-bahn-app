import React from "react";
import PT from "prop-types";

import style from "./style.module.scss";
import SearchTabFilters from "./filters";

export default function FiltersSideMenu({ achievements }) {
  return (
    <div className={style.container}>
      <SearchTabFilters achievements={achievements} />
    </div>
  );
}

FiltersSideMenu.propTypes = {
  achievements: PT.array.isRequired,
};
