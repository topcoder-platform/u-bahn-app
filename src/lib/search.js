import React from "react";
import { createContext, useContext, useState } from "react";
import config from "../config";

export const FILTERS = {
  LOCATIONS: 0,
  SKILLS: 1,
  ACHIEVEMENTS: 2,
  AVAILABILITY: 3,
  HOME_OFFICE: 4,
  CUSTOM: 5,
};

const defaultFilters = {
  [FILTERS.LOCATIONS]: {
    text: "Location",
    group: "General attributes",
    active: true,
  },
  [FILTERS.SKILLS]: {
    text: "Skills",
    group: "General attributes",
    active: true,
  },
  [FILTERS.ACHIEVEMENTS]: {
    text: "Achievements",
    group: "General attributes",
    active: true,
  },
  [FILTERS.AVAILABILITY]: {
    text: "Availability",
    group: "General attributes",
    active: true,
  },
  [FILTERS.HOME_OFFICE]: {
    text: "Home office",
    group: "Company attributes",
    active: false,
  },
  [FILTERS.CUSTOM]: {
    text: "Custom attribute",
    group: "Company attributes",
    active: false,
  },
};

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
  const [query, setQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState({
    isAvailableSelected: false,
    isUnavailableSelected: false,
  });
  const [popupShown, setPopupShown] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: config.ITEMS_PER_PAGE,
  });

  const showPopup = () => {
    setPopupShown(true);
  };

  const isFilterActive = (filter) => {
    return filters[filter].active;
  };

  const activateFilter = (id) => {
    filters[id].active = true;
    setFilters(filters);
  };

  const desactivateFilter = (id) => {
    filters[id].active = false;
    setFilters(filters);
  };

  const desactivateAllFilters = () => {
    for (let [, filter] of Object.entries(filters)) {
      filter.active = false;
    }
    setFilters(filters);
  };

  const changePageNumber = (newPageNumber) => {
    setPagination({
      ...pagination,
      page: newPageNumber,
    });
  };

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
    popupShown,
    showPopup,
    filters,
    setFilters,
    isFilterActive,
    activateFilter,
    desactivateFilter,
    desactivateAllFilters,
    pagination,
    changePageNumber,
  };
}
