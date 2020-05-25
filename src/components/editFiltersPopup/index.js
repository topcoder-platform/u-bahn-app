import React, { useState, useEffect } from "react";
import PT from "prop-types";
import Button from "../Button";

import utilityStyles from "../../styles/utility.module.css";
import SearchBox from "../searchBox";
import Switch from "../Switch";

import styles from "./popup.module.css";
import style from "./style.module.scss";
import { useSearch } from "../../lib/search";

/**
 * EditFiltersPopup - A popup component for editing the filters of the search page
 * onCancel: function to be called when the Cancel button is clicked
 * onDone: function to be called when the Done button is clicked
 */
export default function EditFiltersPopup({ onCancel, onDone }) {
  const search = useSearch();

  const [searchFilters, setSearchFilters] = useState(search.filters);

  const initialSelection = [];

  const getInitialFilters = (from, filterFn) => {
    const initialSections = [];
    const initialFiltersTemp = {};
    for (let [filterId, filter] of Object.entries(from)) {
      if (!(filter.group in initialFiltersTemp)) {
        initialFiltersTemp[filter.group] = [];
        initialSections.push(filter.group);
      }

      if (filterFn(filter)) {
        initialFiltersTemp[filter.group].push({
          id: parseInt(filterId),
          name: filter.text,
          isActive: filter.active,
        });
      }

      if (filter.active) {
        initialSelection.push(parseInt(filterId));
      }
    }

    return [initialSections, initialFiltersTemp];
  };
  const [initialSections, initialFilters] = getInitialFilters(
    search.filters,
    () => true
  );
  const [filterGroups, setFilterGroups] = useState(initialFilters);
  const [selectedFilters, setSelectedFilters] = useState(initialSelection);
  const [sections, setSections] = useState(initialSections, initialSections);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleDone = () => {
    if (onDone) {
      onDone(selectedFilters);
    }
    search.setFilters(searchFilters);
  };

  const handleFilterValueChanged = (filter, newValue) => {
    var index = selectedFilters.indexOf(filter);
    if (newValue) {
      if (index === -1) {
        setSelectedFilters([filter, ...selectedFilters]);
        setSearchFilters({
          ...search.filters,
          [filter]: { ...search.filters[filter], active: true },
        });
      }
    } else {
      if (index !== -1) {
        setSelectedFilters(selectedFilters.filter((_, i) => i !== index));
        setSearchFilters({
          ...search.filters,
          [filter]: { ...search.filters[filter], active: false },
        });
      }
    }
  };

  const handleSearch = (q) => {
    if (q.length === 0) {
      setFilterGroups(initialFilters);
    } else if (q.length >= 3) {
      const [filteredSections, filteredGroups] = getInitialFilters(
        { ...search.filters },
        (f) => {
          return f.text.toLowerCase().includes(q.toLowerCase());
        }
      );
      if (filteredGroups) {
        setSections(filteredSections);
        setFilterGroups(filteredGroups);
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <div className={styles.popupHeader}>
            <div className={styles.popupTitle}>Add Filters</div>
            <div className={utilityStyles.mt16}>
              <SearchBox
                name="editFiltersSearchbox"
                placeholder="Search filter"
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className={styles.popupBoby}>
            {sections.map((section, index) => {
              const filters = filterGroups[section];
              return (
                <PopupSection
                  key={"section" + index}
                  title={section}
                  filters={filters ? filters : []}
                  onFilterValueChange={handleFilterValueChanged}
                />
              );
            })}
          </div>
          <div className={styles.popupFooter}>
            <div className={styles.popupFooterContent}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button onClick={handleDone} className={style.doneButton}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

EditFiltersPopup.propTypes = {
  onCancel: PT.func,
  onDone: PT.func,
};

function PopupSectionTitle({ text }) {
  return <div className={styles.popupSectionTitle}>{text}</div>;
}

PopupSectionTitle.propTypes = {
  text: PT.string.isRequired,
};

function PopupSectionRow({ id, text, filterActivated = false, onChange }) {
  const [checked, setChecked] = useState(filterActivated);

  useEffect(() => {
    setChecked(filterActivated);
  }, [filterActivated]);

  const handleChange = (newValue) => {
    setChecked(newValue);
    if (onChange) {
      onChange(id, newValue);
    }
  };

  return (
    <div className={styles.popupSectionRow}>
      <div className={styles.popupSectionRowText}>{text}</div>
      <div className={styles.popupSectionRowSwitch}>
        {<Switch checked={checked} onChange={() => handleChange(!checked)} />}
      </div>
    </div>
  );
}

PopupSectionRow.propTypes = {
  id: PT.number.isRequired,
  text: PT.string.isRequired,
  filterActivated: PT.bool,
  onChange: PT.func,
};

function PopupSection({ title, filters, onFilterValueChange }) {
  const handleChange = (filter, newValue) => {
    if (onFilterValueChange) {
      onFilterValueChange(filter, newValue);
    }
  };

  return (
    <>
      <PopupSectionTitle text={title} />
      <div className={styles.popupSectionBody}>
        {filters.map((filter, index) => {
          return (
            <PopupSectionRow
              key={index}
              text={filter.name}
              filterActivated={filter.isActive}
              id={filter.id}
              onChange={handleChange}
            />
          );
        })}
      </div>
    </>
  );
}

PopupSection.propTypes = {
  title: PT.string.isRequired,
  filters: PT.array.isRequired,
  onFilterValueChange: PT.func,
};
