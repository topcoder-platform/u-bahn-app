import React from "react";
import styles from "./style.module.scss";

export default function OrgSelector({ userOrgs, onSelectOrg, loadingOrgs }) {
  return (
    <div className={styles.orgSelectorContainer}>
      <p className={styles.visibleCardsInfo}>
        {userOrgs.length > 1 ? (
          <>
            Your user is associated with multiple organizations.
            <br />
            Which one would you like to search under ?
          </>
        ) : loadingOrgs ? (
          "Loading organization details..."
        ) : userOrgs.length === 0 ? (
          "No organizations found for your user"
        ) : (
          ""
        )}
      </p>
      {userOrgs.map((o) => (
        <div className={styles.org} key={o.id} onClick={() => onSelectOrg(o)}>
          {o.name}
        </div>
      ))}
    </div>
  );
}
