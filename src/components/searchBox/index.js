import React, { useState } from 'react';
import PT from 'prop-types';
import styles from './searchBox.module.css';

/**
 * Searchbox
 */
export default function SearchBox({ name, value, placeholder, onChange }) {
    const [query, setQuery] = useState(value ? value : '');

    const handleChange = (event) => {
        const val = event.target.value;
        setQuery(val);
        if (onChange) {
            onChange(val);
        };
    }

    return (
        <div className={styles.searchbox}>
            <div className={styles.searchboxItems}>
                <i className={styles.searchboxIcon}></i>
                <input
                    className={styles.searchboxInput}
                    type='search'
                    name={name}
                    value={query}
                    placeholder={placeholder}
                    onChange={handleChange} />
            </div>
        </div>
    );
}

SearchBox.propTypes = {
    name: PT.string.isRequired,
    value: PT.string,
    placeholder: PT.string,
    onChange: PT.func
};