import React, { useState, useEffect } from 'react';
import TabPageLayout from '../tabPageLayout';
import PagedResults from '../pagedResults';
import GroupTabFilters from './filters'
import PropTypes from 'prop-types';

export default function GroupTab({ userGroups, allGroups, profiles }) {
    const [data, setData] = useState(profiles);
    const [userGroupsData, setUserGroupsData] = useState(userGroups);
    const [allGroupsData, setAllGroupsData] = useState(userGroups);

    useEffect(() => {
        setData(profiles);
        setUserGroupsData(userGroups);
        setAllGroupsData(allGroups);
    }, [profiles, userGroups, allGroups])

    const handleGroupSelected = (group) => {
        const newData = profiles.filter((item) => {
            return item.groups.indexOf(group.name) > -1;
        });
        setData(newData);
    };

    return (
        <TabPageLayout
            leftComponent={<GroupTabFilters myGroups={userGroupsData} groups={allGroupsData} onGroupSelected={handleGroupSelected} />}
            rightComponent={<PagedResults data={data} pageSize={10} selected={1} />} />
    );
}

GroupTab.propTypes = {
    userGroups: PropTypes.array.isRequired,
    allGroups: PropTypes.array.isRequired,
    profiles: PropTypes.array
}