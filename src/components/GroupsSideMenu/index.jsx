import React, { useState, useEffect } from "react";
import PT from "prop-types";

import style from "./style.module.scss";
import GroupTabFilters from "./filters";

export default function GroupsSideMenu({ userGroups, allGroups }) {
  const [userGroupsData, setUserGroupsData] = useState(userGroups);
  const [allGroupsData, setAllGroupsData] = useState(allGroups);

  useEffect(() => {
    setUserGroupsData(userGroups);
    setAllGroupsData(allGroups);
  }, [userGroups, allGroups]);

  const handleGroupSelected = (group) => {
    // TODO - When a group is selected, make the search request again
  };

  return (
    <div className={style.container}>
      <GroupTabFilters
        myGroups={userGroupsData}
        groups={allGroupsData}
        onGroupSelected={handleGroupSelected}
      />
    </div>
  );
}

GroupsSideMenu.propTypes = {
  userGroups: PT.array.isRequired,
  allGroups: PT.array.isRequired,
};
