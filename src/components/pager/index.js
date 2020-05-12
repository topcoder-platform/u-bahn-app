import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './pager.module.css';
import iconStyles from '../../styles/icons.module.css';

const ICONS = {
    LEFT_ARROW: 0,
    RIGHT_ARROW: 1
}

function getPageFirstItemIndex(pageSize, selectedPage) {
    return pageSize * selectedPage - (pageSize - 1);
}

function getPageLastItemIndex(pageSize, selectedPage, totalPages) {
    return Math.min(pageSize * selectedPage, totalPages);
}

/**
 * Pager - a pager component
 * selectedPage: the initially selected page
 * totalPages: total number of pages
 * pageSize: the size of a page
 * onPageChanged: function to be called when page changes
 */
export default function Pager({ selectedPage = 1, totalPages = 1, pageSize = 5, onPageChanged }) {
    const [selectedItem, setSelectedItem] = useState(selectedPage);

    const pagerPage = Math.floor((selectedItem - 1) / pageSize) + 1;
    const firstItem = getPageFirstItemIndex(pageSize, pagerPage);
    const lastItem = getPageLastItemIndex(pageSize, pagerPage, totalPages);
    const itemPosition = selectedItem - firstItem + 1;
    const hasItemsOnLeft = selectedItem > 1;
    const hasItemsOnRight = selectedItem < totalPages;

    const selectPage = (pageNumber) => {
        setSelectedItem(pageNumber);
        if (onPageChanged) {
            onPageChanged(pageNumber);
        }
    }

    const goToNextPagerPage = () => {
        selectPage(selectedItem + 1);
    }

    const goToPreviousPagerPage = () => {
        selectPage(selectedItem - 1);
    }

    useEffect(() => {
        setSelectedItem(selectedPage);
    }, [selectedPage])


    let pagerItems = [];
    for (let i = 1; i <= (lastItem - firstItem + 1); i++) {
        const pageNumber = firstItem + i - 1;
        const item = <PagerButton
            key={pageNumber}
            number={pageNumber}
            isSelected={itemPosition === i}
            action={() => selectPage(pageNumber)} />
        pagerItems.push(item);
    }

    return (
        <div className={styles.pager}>
            <PagerButton icon={ICONS.LEFT_ARROW} isDisabled={!hasItemsOnLeft} action={goToPreviousPagerPage} />
            {pagerItems}
            <PagerButton icon={ICONS.RIGHT_ARROW} isDisabled={!hasItemsOnRight} action={goToNextPagerPage} />
        </div>
    );
}

Pager.propTypes = {
    selectedPage: PropTypes.number,
    totalPages: PropTypes.number,
    pageSize: PropTypes.number,
    onPageChanged: PropTypes.func
}

function PagerButton({ number, icon = null, isSelected = false, isDisabled = false, action }) {
    const mainClass = isDisabled
        ? styles.pagerItemDisabled
        : isSelected ? styles.pagerItemSelected : styles.pagerItem;

    const iconClassEnabled = icon === ICONS.LEFT_ARROW ? iconStyles.larrow : iconStyles.rarrow;
    const iconClassDisabled = icon === ICONS.LEFT_ARROW ? iconStyles.larrowDisabled : iconStyles.rarrowDisabled;
    const iconClass = isDisabled ? iconClassDisabled : iconClassEnabled;

    const iconElement = icon != null
        ? <div className={iconClass}></div>
        : null;

    const handleClick = () => {
        if (!isDisabled) {
            action();
        }
    }

    return (
        <div className={mainClass} onClick={handleClick}>{iconElement ? iconElement : number}</div>
    );
}

PagerButton.propTypes = {
    number: PropTypes.number,
    icon: PropTypes.number,
    isSelected: PropTypes.bool,
    isDisabled: PropTypes.bool,
    action: PropTypes.func
}