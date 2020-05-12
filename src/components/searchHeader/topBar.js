import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './topBar.module.css';

/**
 * SearchHeaderTopBar - contains the logo, search box, and user profile button
 * onSearch: function to be called when the text changes in the header search box
 */
export default function SearchHeaderTopBar({ onSearch }) {
  return (
    <div className={styles.headerTopBar}>
      <Logo />
      <TopBarSearch placeholder='Search talent or keyword' onChange={onSearch} />
      <LoggedInUser userName='Ashton W' />
    </div>
  );
}

SearchHeaderTopBar.propTypes = {
  onSearch: PropTypes.func
}


function Logo() {
  return (
    <div className={styles.headerTopBarLogo}>
      <div>U-BAHN</div>
    </div>
  );
}

function TopBarSearch({ placeholder, onChange }) {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    const val = event.target.value;
    setQuery(val);
    if (onChange) {
      onChange(val);
    };
  }

  return (
    <div className={styles.topBarSearch}>
      <div className={styles.topBarSearchItems}>
        <i className={styles.topBarSearchIcon}></i>
        <input
          className={styles.topBarSearchBox}
          type='search'
          name='topBarSearch'
          value={query}
          placeholder={placeholder}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

TopBarSearch.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func
}

function LoggedInUser({ userName }) {
  return (
    <div className={styles.loggedInUser}>
      <div className={styles.loggedInUserName}>{userName}</div>
      <i className={styles.chevronIcon}></i>
    </div>
  );
}

LoggedInUser.propTypes = {
  userName: PropTypes.string.isRequired
}