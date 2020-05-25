import React, { useState, useEffect } from "react";
import PT from "prop-types";

import style from "./style.module.scss";
import GroupTabFilters from "./filters";

export default function GroupsSideMenu({ userGroups, allGroups, profiles }) {
  const [data, setData] = useState(profiles);
  const [userGroupsData, setUserGroupsData] = useState(userGroups);
  const [allGroupsData, setAllGroupsData] = useState(userGroups);

  useEffect(() => {
    setData(profiles);
    setUserGroupsData(userGroups);
    setAllGroupsData(userGroups);
  }, [profiles, userGroups, allGroups]);

  const handleGroupSelected = (group) => {
    const newData = profiles.filter((item) => {
      return item.groups && item.groups.indexOf(group.name) > -1;
    });
    setData(newData);
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

GroupsSideMenu.propTypes = {};
