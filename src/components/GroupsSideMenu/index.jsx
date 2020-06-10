import React, { useState, useEffect } from "react";
import PT from "prop-types";

import style from "./style.module.scss";
import GroupTabFilters from "./filters";

export default function GroupsSideMenu({ userGroups, otherGroups }) {
  const [userGroupsData, setUserGroupsData] = useState(userGroups);
  const [otherGroupsData, setOtherGroupsData] = useState(otherGroups);

  useEffect(() => {
    setUserGroupsData(userGroups);
    setOtherGroupsData(otherGroups);
  }, [userGroups, otherGroups]);

  const handleGroupSelected = (group) => {
    // TODO - When a group is selected, make the search request again
  };

  return (
    <div className={style.container}>
      <GroupTabFilters
        myGroups={userGroupsData}
        groups={otherGroupsData}
        onGroupSelected={handleGroupSelected}
      />
    </div>
  );
}

GroupsSideMenu.propTypes = {
  userGroups: PT.array.isRequired,
  otherGroups: PT.array.isRequired,
};
