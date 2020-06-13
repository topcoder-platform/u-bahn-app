import React, { useState, useEffect, useCallback } from "react";
import PT from "prop-types";
import Button from "../Button";
import WideButton from "../wideButton";
import Collapsible from "../collapsible";
import SearchBox from "../searchBox";
import Availability from "../availability";
import TagList from "../tagList";
import EditFiltersPopup from "../editFiltersPopup";
import SuggestionBox from "../SuggestionBox";
import Pill from "../Pill";

import { useSearch, FILTERS } from "../../lib/search";
import { useModal } from "../../lib/modal";

import styles from "./filters.module.css";
import utilityStyles from "../../styles/utility.module.css";

/**
 * SearchTabFilters - component containing all the filters on the search tab page
 * locations: the values for the location filter options
 * achievements: the values for the achievements filter options
 */
export default function SearchTabFilters({ locations, achievements }) {
  const search = useSearch();
  const [locationsData, setLocationsData] = useState(locations);
  const [achievementsData, setAchievementsData] = useState(achievements);

  useEffect(() => {
    setLocationsData(locations);
    setAchievementsData(achievements);
  }, [locations, achievements]);

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

    search.getCompanyAttrActiveFilter().forEach((filter) => {
      if (
        search.selectedCompanyAttributes[filter.id] &&
        search.selectedCompanyAttributes[filter.id].length > 0
      ) {
        appliedFilters += 1;
      }
    });

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

  const addSkillToFilter = (skill) => {
    const skillFilters = JSON.parse(JSON.stringify(search.selectedSkills));

    if (skillFilters.findIndex((s) => s.id === skill.id) !== -1) {
      return;
    }

    skillFilters.push(skill);
    search["selectSkills"](skillFilters);
  };

  const removeSkillFromFilter = (skill) => {
    const skillFilters = JSON.parse(JSON.stringify(search.selectedSkills));
    const index = skillFilters.findIndex((s) => s.id === skill.id);

    if (index === -1) {
      return;
    }

    skillFilters.splice(index, 1);
    search["selectSkills"](skillFilters);
  };

  const addCompanyAttributeToFilter = (attrId, data) => {
    const companyAttrFilters = JSON.parse(
      JSON.stringify(search.selectedCompanyAttributes)
    );

    if (attrId in companyAttrFilters) {
      if (
        companyAttrFilters[attrId].findIndex((s) => s.id === data.id) !== -1
      ) {
        return;
      }
    } else {
      companyAttrFilters[attrId] = [];
    }

    companyAttrFilters[attrId].push(data);
    search["selectCompanyAttributes"](companyAttrFilters);
  };

  const removeCompanyAttributeFromFilter = (attrId, data) => {
    const companyAttrFilters = JSON.parse(
      JSON.stringify(search.selectedCompanyAttributes)
    );
    const index = companyAttrFilters[attrId].findIndex((s) => s.id === data.id);

    if (index === -1) {
      return;
    }

    companyAttrFilters[attrId].splice(index, 1);
    search["selectCompanyAttributes"](companyAttrFilters);
  };

  const companyAttrFiltersComponent = search
    .getCompanyAttrActiveFilter()
    .map((filter) => (
      <div className={utilityStyles.mt32} key={filter.id}>
        <Collapsible title={filter.text}>
          <SuggestionBox
            placeholder="Search values to filter with"
            purpose="companyAttributes"
            companyAttrId={filter.id}
            onSelect={addCompanyAttributeToFilter}
          />
          {filter.id in search.selectedCompanyAttributes &&
            search.selectedCompanyAttributes[filter.id].length > 0 && (
              <div className={utilityStyles.mt16}>
                {search.selectedCompanyAttributes[filter.id].map((data) => {
                  return (
                    <Pill
                      key={data.id}
                      name={data.value}
                      removable={true}
                      onRemove={() =>
                        removeCompanyAttributeFromFilter(filter.id, data)
                      }
                    />
                  );
                })}
              </div>
            )}
        </Collapsible>
      </div>
    ));

  return (
    <div className={styles.searchTabFilters}>
      <Summary filtersApplied={numberOfFiltersApplied} />
      {search.isFilterActive(FILTERS.LOCATIONS) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Location" collapsed={false}>
            <SearchBox
              placeholder="Search for a location"
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
              noResultsText={"No location found"}
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
            <SuggestionBox
              placeholder={"Search skill to filter with"}
              onSelect={addSkillToFilter}
              purpose="skills"
            />
            {search.selectedSkills.length > 0 && (
              <div className={utilityStyles.mt16}>
                {search.selectedSkills.map((skill) => {
                  return (
                    <Pill
                      key={skill.id}
                      name={skill.name}
                      removable={true}
                      onRemove={() => removeSkillFromFilter(skill)}
                    />
                  );
                })}
              </div>
            )}
          </Collapsible>
        </div>
      )}
      {search.isFilterActive(FILTERS.ACHIEVEMENTS) && (
        <div className={utilityStyles.mt32}>
          <Collapsible title="Achievements">
            <SearchBox
              placeholder="Search for an achievement"
              name={"achievements search"}
              onChange={(q) =>
                filterData(q, achievements, "name", setAchievementsData)
              }
            />
            <TagList
              tags={achievementsData}
              selected={search.selectedAchievements}
              selector={"selectAchievements"}
              noResultsText={"No achievement found"}
            />
          </Collapsible>
        </div>
      )}
      {companyAttrFiltersComponent}

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
    search.selectCompanyAttributes({});
    search.changePageNumber(1);
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
