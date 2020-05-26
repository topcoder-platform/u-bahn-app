import React, { useState, useEffect, useCallback } from "react";
import PT from "prop-types";
import Button from "../Button";
import WideButton from "../wideButton";
import Collapsible from "../collapsible";
import SearchBox from "../searchBox";
import Availability from "../availability";
import TagList from "../tagList";
import EditFiltersPopup from "../editFiltersPopup";

import { useSearch, FILTERS } from "../../lib/search";
import { useModal } from "../../lib/modal";

import styles from "./filters.module.css";
import utilityStyles from "../../styles/utility.module.css";

/**
 * SearchTabFilters - component containing all the filters on the search tab page
 * locations: the values for the location filter options
 * skills: the values for the skills filter options
 * achievements: the values for the achievements filter options
 */
export default function SearchTabFilters({ locations, skills, achievements }) {
  const search = useSearch();
  const [locationsData, setLocationsData] = useState(locations);
  const [skillsData, setSkillsData] = useState(skills);
  const [achievementsData, setAchievementsData] = useState(achievements);

  useEffect(() => {
    setLocationsData(locations);
    setSkillsData(skills);
    setAchievementsData(achievements);
  }, [locations, skills, achievements]);

  const filterData = (query, initialValues, property, setState) => {
    const q = query.toLowerCase();
    if (q.length >= 3) {
      setState(
        initialValues.filter((g) => g[property].toLowerCase().includes(q))
      );
    } else if (query.length === 0) {
      setState(initialValues);
    }
  };

  const [numberOfFiltersApplied, setNumberOfFiltersApplied] = useState();
  const modal = useModal();

  const handlePopupCancel = () => {
    modal.hideModal();
  };

  const handlePopupDone = (filtersSelected) => {
    modal.hideModal();
    search.desactivateAllFilters();
    filtersSelected.forEach((id) => {
      search.activateFilter(id);
    });

    setNumberOfFiltersApplied(getAppliedFilters());
  };

  const getAppliedFilters = useCallback(() => {
    let appliedFilters = 0;
    if (search.isFilterActive(FILTERS.LOCATIONS)) {
      if (search.selectedLocations.length > 0) {
        appliedFilters += 1;
      }
    }

    if (search.isFilterActive(FILTERS.SKILLS)) {
      if (search.selectedSkills.length > 0) {
        appliedFilters += 1;
      }
    }

    if (search.isFilterActive(FILTERS.ACHIEVEMENTS)) {
      if (search.selectedAchievements.length > 0) {
        appliedFilters += 1;
      }
    }

    if (search.isFilterActive(FILTERS.AVAILABILITY)) {
      if (
        search.selectedAvailability.isAvailableSelected ||
        search.selectedAvailability.isUnavailableSelected
      ) {
        appliedFilters += 1;
      }
    }

    return appliedFilters;
  }, [search]);

  useEffect(() => {
    setNumberOfFiltersApplied(getAppliedFilters());
  }, [getAppliedFilters]);

  const handleAddFilter = () => {
    if (modal.isModalOpen) {
      modal.hideModal();
    } else {
      modal.showModal();
    }
  };

  return (
    <div className={styles.searchTabFilters}>
      <Summary filtersApplied={numberOfFiltersApplied} />
      {search.isFilterActive(FILTERS.LOCATIONS) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Location" collapsed={false}>
            <SearchBox
              placeholder="Search by location"
              name={"location search"}
              onChange={(q) =>
                filterData(q, locations, "name", setLocationsData)
              }
            />
            <TagList
              key="l"
              tags={locationsData}
              selected={search.selectedLocations}
              selector={"selectLocations"}
            />
          </Collapsible>
        </div>
      )}
      {search.isFilterActive(FILTERS.AVAILABILITY) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Availability">
            <Availability
              availableSelected={
                search.selectedAvailability.isAvailableSelected
              }
              unavailableSelected={
                search.selectedAvailability.isUnavailableSelected
              }
              selector={"selectAvailability"}
            />
          </Collapsible>
        </div>
      )}
      {search.isFilterActive(FILTERS.SKILLS) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Skills">
            <SearchBox
              placeholder="Search by skill"
              name={"skills search"}
              onChange={(q) => filterData(q, skills, "name", setSkillsData)}
            />
            <TagList
              tags={skillsData}
              selected={search.selectedSkills}
              selector={"selectSkills"}
            />
          </Collapsible>
        </div>
      )}
      {search.isFilterActive(FILTERS.ACHIEVEMENTS) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Achievements">
            <SearchBox
              placeholder="Search by achievement"
              name={"achievements search"}
              onChange={(q) =>
                filterData(q, achievements, "name", setAchievementsData)
              }
            />
            <TagList
              tags={achievementsData}
              selected={search.selectedAchievements}
              selector={"selectAchievements"}
            />
          </Collapsible>
        </div>
      )}

      <div className={utilityStyles.mt32}>
        <WideButton text="+ Add filter" action={handleAddFilter} />
      </div>
      {modal.isModalOpen && (
        <EditFiltersPopup
          onCancel={handlePopupCancel}
          onDone={handlePopupDone}
        />
      )}
    </div>
  );
}

SearchTabFilters.propTypes = {
  locations: PT.array,
  skills: PT.array,
  achievements: PT.array,
};

function Summary({ filtersApplied }) {
  const search = useSearch();

  const handleReset = () => {
    search.selectLocations([]);
    search.selectSkills([]);
    search.selectAchievements([]);
    search.selectAvailability({
      isAvailableSelected: false,
      isUnavailableSelected: false,
    });
  };

  return (
    <div className={styles.searchTabFiltersSummary}>
      <div className={styles.searchTabFiltersSummaryTextContainer}>
        <div className={styles.searchTabFiltersSummaryTextContainerRow}>
          <div className={styles.searchTabFiltersSummaryTextIcon}></div>
          <div className={styles.searchTabFiltersSummaryText}>
            {filtersApplied} filters applied
          </div>
        </div>
      </div>
      <div className={styles.searchTabFiltersSummaryResetBtn}>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
}
