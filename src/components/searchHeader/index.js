import React from 'react';
import PropTypes from 'prop-types';
import SearchHeaderTopBar from './topBar';
import SearchHeaderHeroNav from './heroNav';

import styles from './searchHeader.module.css';

/**
 * Search Header component - contains the top bar and the hero navigation
 * onSearch: function to be called when the text changes in the header search box
 */
export default function SearchHeader({ onSearch }) {
  return (
    <header className={styles.header}>
      <SearchHeaderTopBar onSearch={onSearch} />
      <SearchHeaderHeroNav />
    </header>
  );
}

SearchHeader.propTypes = {
  onSearch: PropTypes.func
}