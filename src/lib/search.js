import React from 'react';
import { createContext, useContext, useState } from 'react';

export const FILTERS = {
  LOCATIONS: 0,
  SKILLS: 1,
  ACHIEVEMENTS: 2,
  AVAILABILITY: 3,
  PROJECTS_COMPLETED: 4,
  RATING: 5,
  HOME_OFFICE: 6,
  RANK: 7,
  CUSTOM: 8
}

const defaultFilters = {
  [FILTERS.LOCATIONS]: {
    text: 'Location',
    group: 'General attributes',
    active: true
  },
  [FILTERS.SKILLS]: {
    text: 'Skills',
    group: 'General attributes',
    active: true
  },
  [FILTERS.ACHIEVEMENTS]: {
    text: 'Achievements',
    group: 'General attributes',
    active: true
  },
  [FILTERS.AVAILABILITY]: {
    text: 'Availability',
    group: 'General attributes',
    active: true
  },
  [FILTERS.RATING]: {
    text: 'Rating',
    group: 'General attributes',
    active: false
  },
  [FILTERS.PROJECTS_COMPLETED]: {
    text: 'Projects completed',
    group: 'General attributes',
    active: false
  },
  [FILTERS.HOME_OFFICE]: {
    text: 'Home office',
    group: 'Company attributes',
    active: false
  },
  [FILTERS.RANK]: {
    text: 'Rank',
    group: 'Company attributes',
    active: false
  },
  [FILTERS.CUSTOM]: {
    text: 'Custom attribute',
    group: 'Company attributes',
    active: false
  }
}

const SearchContext = createContext({});

export function SearchContextProvider({ children }) {
  const search = useProvideSearch();
  return (
    <SearchContext.Provider value={search}>{children}</SearchContext.Provider>
  );
}

export const useSearch = () => {
  return useContext(SearchContext);
};

function useProvideSearch() {
  const [query, setQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState({
    isAvailableSelected: false,
    isUnavailableSelected: false
  });
  const [ratingLevel, setRatingLevel] = useState(0);
  const [ratingRange, setRatingRange] = useState({
    lowLimit: 0,
    highLimit: 10,
    rangeMin: 0,
    rangeMax: 20
  })
  const [projectsLevel, setProjectsLevel] = useState(0);
  const [projectsRange, setProjectsRange] = useState({
    lowLimit: 0,
    highLimit: 10,
    rangeMin: 0,
    rangeMax: 10
  })
  const [popupShown, setPopupShown] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)

  const showPopup = () => {
    setPopupShown(true);
  };

  const isFilterActive = filter => {
    return filters[filter].active;
  }

  const activateFilter = id => {
    filters[id].active = true;
    setFilters(filters);
  }

  const desactivateFilter = id => {
    filters[id].active = false;
    setFilters(filters);
  }

  const desactivateAllFilters = () => {
    for (let [, filter] of Object.entries(filters)) {
      filter.active = false;
    }
    setFilters(filters);
  }

  return {
    query,
    setQuery,
    selectedLocations,
    selectLocations: setSelectedLocations,
    selectedSkills,
    selectSkills: setSelectedSkills,
    selectedAchievements,
    selectAchievements: setSelectedAchievements,
    selectedAvailability,
    selectAvailability: setSelectedAvailability,
    ratingLevel,
    setRatingLevel,
    ratingRange,
    setRatingRange,
    projectsLevel,
    setProjectsLevel,
    projectsRange,
    setProjectsRange,
    popupShown,
    showPopup,
    filters,
    setFilters,
    isFilterActive,
    activateFilter,
    desactivateFilter,
    desactivateAllFilters
  };
}
