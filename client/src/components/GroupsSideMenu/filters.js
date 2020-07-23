import React, { useState, useEffect } from "react";
import PT from "prop-types";

import SearchBox from "../searchBox";
import Button from "../Button";

import styles from "./filters.module.css";
import style from "./style.module.scss";
import iconStyles from "../../styles/icons.module.css";

/**
 * GroupTabFilters - component containing the group tab filters column
 * myGroups: user groups
 * groups: all groups
 * onGroupSelected: function to be called when a group is clicked
 */
export default function GroupTabFilters({
  myGroups,
  groups,
  onGroupSelected,
  loadingGroups,
  creatingGroup,
  onCreateNewGroup,
}) {
  const handleGroupItemClicked = (group, item, index) => {
    setSelectedGroup(group);
    setSelectedIndex(index);
    if (onGroupSelected) {
      onGroupSelected(item);
    }
  };

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [myGroupsData, setMyGroupsData] = useState(myGroups);
  const [groupsData, setGroupsData] = useState(groups);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setMyGroupsData(myGroups);
    setGroupsData(groups);
    setSearchText("");
  }, [myGroups, groups]);

  const filterGroups = (query) => {
    setSearchText(query);
  };

  const createGroup = () => {
    const groupName = searchText.trim();
    if (groupName.length === 0) {
      alert("Enter a group name");
      return;
    }

    onCreateNewGroup(groupName);
  };

  return (
    <div className={styles.groupTabFilters}>
      <div className={styles.groupTabFiltersTitleContainer}>
        <div className={styles.groupTabFiltersTitle}>Groups</div>
      </div>
      <div className={styles.groupTabFiltersContent}>
        <div className={styles.groupTabFiltersContentSearch}>
          <div className={styles.groupTabFiltersContentSearchbox}>
            <SearchBox
              value={searchText}
              placeholder="Search or create group"
              name={"groups search"}
              onChange={filterGroups}
              disabled={loadingGroups}
            />
          </div>
          <div className={styles.groupTabFiltersContentSearchCreate}>
            <Button
              className={style.createButton}
              disabled={creatingGroup}
              onClick={createGroup}
            >
              {creatingGroup ? "Creating..." : "+ Create"}
            </Button>
          </div>
        </div>
        <div className={styles.groupTabGroupsContainer}>
          <GroupsSection
            title={loadingGroups ? "My Groups (Loading...)" : "My Groups"}
            items={myGroupsData.filter((group) =>
              group.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            onItemClicked={handleGroupItemClicked}
            selectedIndex={selectedGroup === "My Groups" ? selectedIndex : -1}
          />
          <GroupsSection
            title={loadingGroups ? "Other Groups (Loading...)" : "Other Groups"}
            items={groupsData.filter((group) =>
              group.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            onItemClicked={handleGroupItemClicked}
            selectedIndex={
              selectedGroup === "Other Groups" ? selectedIndex : -1
            }
          />
        </div>
      </div>
    </div>
  );
}

GroupTabFilters.propTypes = {
  myGroups: PT.array,
  groups: PT.any,
  onGroupSelected: PT.func,
  loadingGroups: PT.bool,
  creatingGroup: PT.bool,
  onCreateNewGroup: PT.func,
};

function GroupsSection({ title, items, onItemClicked, selectedIndex }) {
  const [selected, setSelected] = useState(selectedIndex);
  useEffect(() => {
    setSelected(selectedIndex);
  }, [selectedIndex]);

  return (
    <>
      <div className={styles.sectionTitle}>{title}</div>
      <div className={styles.sectionItemsContainer}>
        {items.map((item, index) => {
          return (
            <SectionRow
              key={`${title}${index}`}
              title={item.name}
              badge={item.count + ""}
              action={() => index !== selected && onItemClicked && onItemClicked(title, item, index)}
              selected={index === selected}
            />
          );
        })}
      </div>
    </>
  );
}

GroupsSection.propTypes = {
  title: PT.string.isRequired,
  items: PT.array.isRequired,
  onItemClicked: PT.func,
  selectedIndex: PT.number,
};

function SectionRow({ title, badge, selected = false, action }) {
  return (
    <div
      className={selected ? styles.sectionItemSelected : styles.sectionItem}
      onClick={action}
    >
      <div
        className={
          selected ? styles.sectionItemSelectedTitle : styles.sectionItemTitle
        }
      >
        {title}
      </div>
      <div
        className={
          selected ? styles.sectionItemSelectedBadge : styles.sectionItemBadge
        }
      >
        {badge}
        {selected && (
          <div className={styles.sectionItemChevron}>
            <div className={iconStyles.chevronRightW} />
          </div>
        )}
      </div>
    </div>
  );
}

SectionRow.propTypes = {
  title: PT.string.isRequired,
  badge: PT.string.isRequired,
  selected: PT.bool,
  action: PT.func,
};
