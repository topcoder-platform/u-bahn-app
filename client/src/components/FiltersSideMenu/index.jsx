import React from "react";

import style from "./style.module.scss";
import SearchTabFilters from "./filters";

export default function FiltersSideMenu({ achievements }) {
  return (
    <div className={style.container}>
      <SearchTabFilters />
    </div>
  );
}
