import React, { useState, useEffect } from 'react';
import PT from 'prop-types';

import SearchBox from '../searchBox';
import Button from '../Button';

import styles from './filters.module.css';
import style from './style.module.scss';
import iconStyles from '../../styles/icons.module.css';

/**
 * GroupTabFilters - component containing the group tab filters column
 * myGroups: user groups
 * groups: all groups
 * onGroupSelected: function to be called when a group is clicked
 */
export default function GroupTabFilters({ myGroups, groups, onGroupSelected }) {

    const handleGroupItemClicked = (group, item, index) => {
        setSelectedGroup(group);
        setSelectedIndex(index);
        if (onGroupSelected) {
            onGroupSelected(item);
        }
    }

    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [myGroupsData, setMyGroupsData] = useState(myGroups);
    const [groupsData, setGroupsData] = useState(myGroups);

    useEffect(() => {
        setMyGroupsData(myGroups);
        setGroupsData(groups);
    }, [myGroups, groups]);

    const filterGroups = (query) => {
        const q = query.toLowerCase();
        if (q.length >= 3) {
            setMyGroupsData(myGroups.filter(g => g.name.toLowerCase().includes(q)));
            setGroupsData(groups.filter(g => g.name.toLowerCase().includes(q)));
        } else if (query.length === 0) {
            setMyGroupsData(myGroups);
            setGroupsData(groups);
        }
    };

    return (
        <div className={styles.groupTabFilters}>
            <div className={styles.groupTabFiltersTitleContainer} >
                <div className={styles.groupTabFiltersTitle}>
                    Groups
                </div>
            </div>
            <div className={styles.groupTabFiltersContent}>
                <div className={styles.groupTabFiltersContentSearch}>
                    <div className={styles.groupTabFiltersContentSearchbox}>
                        <SearchBox
                            value={''}
                            placeholder='Search or create group'
                            name={'groups search'}
                            onChange={filterGroups} />
                    </div>
                    <div className={styles.groupTabFiltersContentSearchCreate}>
                        <Button className={style.createButton}>+ Create</Button>
                    </div>
                </div>
                <div className={styles.groupTabGroupsContainer}>
                    <GroupsSection
                        title={'My Groups'}
                        items={myGroupsData}
                        onItemClicked={handleGroupItemClicked}
                        selectedIndex={selectedGroup === 'My Groups' ? selectedIndex : -1} />
                    <GroupsSection
                        title={'Other Groups'}
                        items={groupsData}
                        onItemClicked={handleGroupItemClicked}
                        selectedIndex={selectedGroup === 'Other Groups' ? selectedIndex : -1} />
                </div>
            </div>
        </div>
    );
}

GroupTabFilters.propTypes = {
    myGroups: PT.array,
    groups: PT.any,
    onGroupSelected: PT.func
}

function GroupsSection({ title, items, onItemClicked, selectedIndex }) {
    const [selected, setSelected] = useState(selectedIndex);
    useEffect(() => {
        setSelected(selectedIndex);
    }, [selectedIndex])

    return (
        <>
            <div className={styles.sectionTitle}>{title}</div>
            <div className={styles.sectionItemsContainer}>
                {
                    items.map((item, index) => {
                        return <SectionRow
                            key={`${title}${index}`}
                            title={item.name}
                            badge={item.count + ''}
                            action={() => onItemClicked && onItemClicked(title, item, index)}
                            selected={index === selected} />
                    })
                }
            </div>
        </>
    );
}

GroupsSection.propTypes = {
    title: PT.string.isRequired,
    items: PT.array.isRequired,
    onItemClicked: PT.func,
    selectedIndex: PT.number
}

function SectionRow({ title, badge, selected = false, action }) {
    return (
        <div className={selected ? styles.sectionItemSelected : styles.sectionItem} onClick={action}>
            <div className={selected ? styles.sectionItemSelectedTitle : styles.sectionItemTitle}>{title}</div>
            <div className={selected ? styles.sectionItemSelectedBadge : styles.sectionItemBadge}>
                {badge}
                {selected && (
                    <div className={styles.sectionItemChevron}>
                        <div className={iconStyles.chevronRightW} />
                    </div>)}</div>
        </div>
    );
}

SectionRow.propTypes = {
    title: PT.string.isRequired,
    badge: PT.string.isRequired,
    selected: PT.bool,
    action: PT.func
}
