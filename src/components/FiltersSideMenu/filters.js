import React, { useState, useEffect, useCallback } from "react";
import PT from "prop-types";
import Button from "../Button";
import WideButton from "../wideButton";
import Collapsible from "../collapsible";
import SearchBox from "../searchBox";
import Availability from "../availability";
import RangeGroup from "../rangeGroup";
import Tabs from "../tabs";
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

    if (search.isFilterActive(FILTERS.RATING)) {
      let ratingRangeApplied = false;
      if (
        search.ratingRange &&
        (search.ratingRange.lowLimit > search.ratingRange.rangeMin ||
          search.ratingRange.highLimit < search.ratingRange.rangeMax)
      ) {
        ratingRangeApplied = true;
      }
      if (search.ratingLevel || ratingRangeApplied) {
        appliedFilters += 1;
      }
    }

    if (search.isFilterActive(FILTERS.PROJECTS_COMPLETED)) {
      let projectsRangeApplied = false;
      if (
        search.projectsRange &&
        (search.projectsRange.lowLimit > search.projectsRange.rangeMin ||
          search.projectsRange.highLimit < search.projectsRange.rangeMax)
      ) {
        projectsRangeApplied = true;
      }
      if (search.projectsLevel || projectsRangeApplied) {
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
      {search.isFilterActive(FILTERS.PROJECTS_COMPLETED) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Project completed">
            <RangeGroup
              key={1}
              range={search.ratingRange}
              selector={"setProjectsRange"}
            />
            <Tabs
              items={tabItems}
              selectedIndex={0}
              selector={"setProjectsLevel"}
            />
          </Collapsible>
        </div>
      )}
      {search.isFilterActive(FILTERS.RATING) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Rating">
            <RangeGroup
              key={2}
              range={search.projectsRange}
              selector={"setRatingRange"}
            />
            <Tabs items={tabItems} selector={"setRatingLevel"} />
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

const tabItems = [
  {
    text: "New",
  },

  {
    text: "Pro",
  },

  {
    text: "Expert",
  },
];

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
    search.setRatingLevel(null);
    search.setRatingRange({
      lowLimit: 0,
      highLimit: 10,
      rangeMin: 0,
      rangeMax: 10,
    });
    search.setProjectsLevel(null);
    search.setProjectsRange({
      lowLimit: 0,
      highLimit: 10,
      rangeMin: 0,
      rangeMax: 20,
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
