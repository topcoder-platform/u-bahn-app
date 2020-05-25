import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { useSearch } from '../../lib/search';

import styles from './tabs.module.css'

export default function Tabs({ selectedIndex = -1, items, selector }) {
    const search = useSearch();
    const [selectedItem, setSelectedItem] = useState(selectedIndex);

    const selectTab = index => {
        let newValue = -99;
        if (selectedItem === index) {
            newValue = -1;
        } else {
            newValue = index;
        }

        setSelectedItem(newValue);
    };

    useEffect(() => {
        if (selector) {
            if (selectedItem < 0) {
                search[selector](null)
            } else if (selectedItem < items.length) {
                search[selector](items[selectedItem])
            }
        }
    }, [selector, selectedItem])

    return (
        <div className={styles.tabs}>
            {
                items.map((tabItem, index) => {
                    let mainClass = selectedItem === index ? styles.tabContainerSelected : styles.tabContainer;
                    if (index === 0) {
                        mainClass = selectedItem === index ? styles.tabContaineLeftSelected : styles.tabContainerLeft;
                    } else if (index === (items.length - 1)) {
                        mainClass = selectedItem === index ? styles.tabContaineRightSelected : styles.tabContainerRight;
                    }

                    return (<div key={index} className={mainClass} onClick={() => selectTab(index)}>
                        {tabItem.text}
                    </div>)
                })}
        </div>
    );
}

Tabs.propTypes = {
    items: PT.array.isRequired,
    selectedIndex: PT.number,
    selector: PT.string.isRequired
}