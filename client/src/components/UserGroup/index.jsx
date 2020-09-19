import React from "react";
import Pill from "../Pill";

import styles from "./style.module.scss";
import iconStyles from "../../styles/icons.module.css";

export default function UserGroup({
  user,
  removeGroup,
  showManageGroupsModal,
}) {
  const confirmRemoveGroup = (group) => {
    if (
      window.confirm(`Are you sure you want to remove the user from the group?`)
    ) {
      removeGroup(group);
    }
  };
  return (
    <>
      <div className={styles.groupHeading}>
        <div className={iconStyles.bookmark}></div>
        <div className={styles.groupTitle}>groups</div>
      </div>
      <div className={styles.groupContent}>
        {user.groups
          .filter((group) => !group.isDeleted)
          .map((group, index) => {
            return (
              <Pill
                className={styles.pillContainer}
                key={group.id}
                name={group.name}
                removable={true}
                onRemove={() => confirmRemoveGroup(group)}
              />
            );
          })}

        <div className={styles.plusButton} onClick={showManageGroupsModal}>
          <div className={styles.plusButtonIcon}>
            <div className={iconStyles.plus} />
          </div>
        </div>
      </div>
    </>
  );
}
