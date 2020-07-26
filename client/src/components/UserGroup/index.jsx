import React from "react";
import Pill from "../Pill";

import styles from "./style.module.scss";
import iconStyles from "../../styles/icons.module.css";

export default function UserGroup({
  user,
  removeGroup,
  showManageGroupsModal,
}) {
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
                onRemove={() => removeGroup(group)}
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
