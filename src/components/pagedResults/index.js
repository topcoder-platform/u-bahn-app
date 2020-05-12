import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pager from '../pager';
import Grid from '../grid';
import ProfileCard from '../profileCard';

import styles from './pagedResults.module.css';
import iconStyles from '../../styles/icons.module.css'
import { makeColorIterator, avatarColors } from '../../lib/colors';

const colorIterator = makeColorIterator(avatarColors);

/**
 * PagedResults - a component presenting a user profiles with paging
 * data: the array of profiles
 * pageSize: the size of one page
 * selected: the selected page number
 */
export default function PagedResults({ data, pageSize, selected }) {
    const [cardsData, setCardsData] = useState(data);
    const [selectedPage, setSelectedPage] = useState(selected);
    const [totalPages, setTotalPages] = useState(Math.ceil(data.length / pageSize));

    const getFirstIndex = (page) => {
        return Math.min(page * pageSize - (pageSize - 1), data.length);
    };

    const getLastIndex = (page) => {
        const result = Math.min(page * pageSize, data.length);
        return result;
    };

    const [firstIndex, setFirstIndex] = useState(getFirstIndex(selectedPage));
    const [lastIndex, setLastIndex] = useState(getLastIndex(selectedPage));

    const handlePageChanged = newPage => {
        setSelectedPage(newPage);
        setFirstIndex(getFirstIndex(newPage));
        setLastIndex(getLastIndex(newPage));
    };

    useEffect(() => {
        setSelectedPage(selected);
        setFirstIndex(getFirstIndex(selected));
        setLastIndex(getLastIndex(selected));
        setTotalPages(Math.ceil(data.length / pageSize));
        setCardsData(data);
    }, [data, pageSize, selected])

    const isCurrentPageItem = (item, index) => {
        return (index + 1) >= firstIndex && (index + 1) <= lastIndex;
    }

    return (
        <div className={styles.pagedResults}>
            <Header first={firstIndex} last={lastIndex} total={cardsData.length} />
            <div className={styles.resultsBody}>
                <Grid>
                    {
                        cardsData.filter(isCurrentPageItem)
                            .map((profile) => {
                                const nextColor = colorIterator.next();
                                return <ProfileCard key={'profile-' + profile.id} profile={profile} avatarColor={nextColor.value} />
                            })
                    }
                </Grid>
            </div>
            <div className={styles.pagerContainer}>
                <Pager selectedPage={selectedPage} totalPages={totalPages} onPageChanged={handlePageChanged} />
            </div>
        </div>
    );
}

PagedResults.propTypes = {
    data: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired
}

function Header({ first, last, total }) {
    const [firstItem, setFirstItem] = useState(first);
    const [lastItem, setLastItem] = useState(last);
    const [totalItems, setTotalItems] = useState(total);

    useEffect(() => {
        setFirstItem(first);
        setLastItem(last);
        setTotalItems(total);
    }, [first, last, total])

    return (
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <div className={styles.pagingSummary}>Showing {firstItem}-{lastItem} of {totalItems} profiles</div>
                <div className={styles.orderSelector}>
                    <div>Sort by Rating</div>
                    <div className={iconStyles.chevronDownG}></div></div>
            </div>
        </div >
    );
}

Header.propTypes = {
    first: PropTypes.number.isRequired,
    last: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
}