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
  const handleGroupItemClicked = (group, item) => {
    setSelectedGroup(group);
    setSelectedItemId(item.id);
    if (onGroupSelected) {
      onGroupSelected(item);
    }
  };

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(-1);
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
    if (groupName.length < 3) {
      alert("Group name must be more than three characters");
      return;
    }
    if (groupName.length > 150) {
      alert("Group name cannot exceed 150 characters");
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
            selectedItemId={selectedGroup === "My Groups" ? selectedItemId : -1}
            loadingGroups={loadingGroups}
          />
          <GroupsSection
            title={loadingGroups ? "Other Groups (Loading...)" : "Other Groups"}
            items={groupsData.filter((group) =>
              group.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            onItemClicked={handleGroupItemClicked}
            selectedItemId={
              selectedGroup === "Other Groups" ? selectedItemId : -1
            }
            loadingGroups={loadingGroups}
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

function GroupsSection({
  title,
  items,
  onItemClicked,
  selectedItemId,
  loadingGroups,
}) {
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
              action={(isSelected) =>
                !isSelected && onItemClicked && onItemClicked(title, item)
              }
              selected={item.id === selectedItemId}
            />
          );
        })}
      </div>
      {items.length === 0 && !loadingGroups && (
        <div className={styles.message}>No results found</div>
      )}
    </>
  );
}

GroupsSection.propTypes = {
  title: PT.string.isRequired,
  items: PT.array.isRequired,
  onItemClicked: PT.func,
  selectedIndex: PT.number,
  loadingGroups: PT.bool,
};

function SectionRow({ title, badge, selected = false, action }) {
  return (
    <div
      className={selected ? styles.sectionItemSelected : styles.sectionItem}
      onClick={() => {
        action(selected);
      }}
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
