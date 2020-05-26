import React, { useState } from "react";
import PT from "prop-types";

import { useSearch } from "../../lib/search";

import styles from "./availability.module.css";

/* Availability filter component
when any of the 2 states is selected the flag for that
state is set to `true` in the search context */
export default function Availability({
  availableSelected = false,
  unavailableSelected = false,
  selector,
}) {
  const search = useSearch();
  const [isAvailableSelected, setIsAvailableSelected] = useState(
    availableSelected
  );
  const [isUnavailableSelected, setIsUnavailableSelected] = useState(
    unavailableSelected
  );

  const handleAvailableClicked = () => {
    const newValue = !isAvailableSelected;
    setIsAvailableSelected(newValue);
    search[selector]({
      isAvailableSelected: newValue,
    });
  };

  const handleUnvailableClicked = () => {
    const newValue = !isUnavailableSelected;
    setIsUnavailableSelected(newValue);
    search[selector]({
      isUnavailableSelected: newValue,
    });
  };

  return (
    <div className={styles.availabilityContainer}>
      <div
        className={styles.availabilityItemLeft}
        onClick={handleAvailableClicked}
      >
        <div className={styles.availabilityItemGroup}>
          <div
            className={
              isAvailableSelected
                ? styles.availabilityItemStateActive
                : styles.availabilityItemStateInactive
            }
          ></div>
          <div>Available</div>
        </div>
      </div>
      <div
        className={styles.availabilityItemRight}
        onClick={handleUnvailableClicked}
      >
        <div className={styles.availabilityItemGroup}>
          <div
            className={
              isUnavailableSelected
                ? styles.availabilityItemStateActive
                : styles.availabilityItemStateInactive
            }
          ></div>
          <div>Unavailable</div>
        </div>
      </div>
    </div>
  );
}

Availability.propTypes = {
  availableSelected: PT.bool,
  unavailableSelected: PT.bool,
  selector: PT.string.isRequired,
};
