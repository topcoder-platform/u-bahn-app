import React, { useState } from "react";
import PT from "prop-types";
import styles from "./searchBox.module.scss";

/**
 * Searchbox
 */
export default function SearchBox({
  name,
  value,
  placeholder,
  onChange,
  disabled,
}) {
  const [query, setQuery] = useState(value ? value : "");

  React.useEffect(() => {
    setQuery(value ? value : "");
  }, [value]);

  const handleChange = (event) => {
    const val = event.target.value;
    setQuery(val);
    if (onChange) {
      onChange(val);
    }
  };

  const reset = () => {
    setQuery("");
    onChange && onChange("");
  };

  return (
    <div className={styles.searchbox}>
      <div className={styles.searchboxItems}>
        <i className={styles.searchboxIcon}></i>
        <input
          className={styles.searchboxInput}
          name={name}
          value={query}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
        />
        <span
          className={
            query.length > 0
              ? `${styles.resetKeyword}`
              : `${styles.resetKeyword} ${styles.resetKeywordHidden}`
          }
          onClick={() => reset()}
        >
          &times;
        </span>
      </div>
    </div>
  );
}

SearchBox.propTypes = {
  name: PT.string.isRequired,
  value: PT.string,
  placeholder: PT.string,
  onChange: PT.func,
  disabled: PT.bool,
};

SearchBox.defaultProps = {
  disabled: false,
};
