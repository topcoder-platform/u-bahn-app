import React, { useState, useEffect } from "react";
import PT from "prop-types";

import style from "./style.module.scss";
import GroupTabFilters from "./filters";

export default function GroupsSideMenu({
  userGroups,
  otherGroups,
  loadingGroups,
  onGroupSelected,
}) {
  const [userGroupsData, setUserGroupsData] = useState(userGroups);
  const [otherGroupsData, setOtherGroupsData] = useState(otherGroups);

  useEffect(() => {
    setUserGroupsData(userGroups);
    setOtherGroupsData(otherGroups);
  }, [userGroups, otherGroups]);

  return (
    <div className={style.container}>
      <GroupTabFilters
        myGroups={userGroupsData}
        groups={otherGroupsData}
        onGroupSelected={onGroupSelected}
        loadingGroups={loadingGroups}
      />
    </div>
  );
}

GroupsSideMenu.propTypes = {
  userGroups: PT.array.isRequired,
  otherGroups: PT.array.isRequired,
  loadingGroups: PT.bool,
  onGroupSelected: PT.func.isRequired,
};

GroupsSideMenu.defaultProps = {
  loadingGroups: false,
};
