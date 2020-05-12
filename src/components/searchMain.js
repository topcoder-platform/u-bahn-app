import React from 'react';
import PropTypes from 'prop-types';
import { useTabs, TABS } from '../lib/tabs'
import SearchTab from './searchTab';
import GroupTab from './groupTab';
import UploadTab from './uploadTab';

import { useSearch } from '../lib/search';
import backend from '../lib/backend';

export default function SearchMain({ searchQuery }) {
  const search = useSearch();

  const profiles = backend.getProfiles(search)
    // filter by search query
    .filter(p => {
      if (searchQuery.length === 0) {
        return true;
      } else if (searchQuery.length >= 3) {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });

  const tabs = useTabs();
  const myGroups = backend.getMyGroups();
  const groups = backend.getGroups();
  const locations = backend.getLocations();
  const skills = backend.getSkills();
  const achievements = backend.getAchievements();

  const tabMapping = {}
  tabMapping[TABS.SEARCH] = <SearchTab
    locations={locations}
    skills={skills}
    achievements={achievements}
    profiles={profiles} />
  tabMapping[TABS.GROUP] = <GroupTab userGroups={myGroups} allGroups={groups} profiles={profiles} />
  tabMapping[TABS.UPLOAD] = <UploadTab />

  const tabContent = tabMapping[tabs.selectedTab];

  return (
    <main>
      {tabContent}
    </main>
  );
}

SearchMain.propTypes = {
  searchQuery: PropTypes.string.isRequired
}
