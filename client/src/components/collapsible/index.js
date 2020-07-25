import React, { useState } from "react";
import PT from "prop-types";
import styles from "./collapsible.module.css";
import iconStyles from "../../styles/icons.module.css";

/**
 * Collapsible component - allows an area to be collapsed and expanded
 * title: the title on top of the collapsible
 * childre: children component
 * collapse: if set to true the component is collapsed
 */
export default function Collapsible({
  title,
  children,
  collapsed = false,
  onCollapsed,
}) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const mainStyle = isCollapsed
    ? styles.collapsibleContainerCollapsed
    : styles.collapsibleContainer;

  const handleCollapseChange = () => {
    setIsCollapsed(!isCollapsed);
    if (onCollapsed) onCollapsed(isCollapsed);
  };

  return (
    <div className={mainStyle}>
      <div className={styles.collapsibleHeader}>
        <div className={styles.collapsibleTitle}>{title}</div>
        <div
          className={styles.collapsibleChevronContainer}
          onClick={handleCollapseChange}
        >
          {isCollapsed ? (
            <div className={iconStyles.chevronDownG}></div>
          ) : (
            <div className={iconStyles.chevronUpG}></div>
          )}
        </div>
      </div>
      {/* Divider between header and body */}
      {isCollapsed ? (
        <div></div>
      ) : (
        <div className={styles.collapsibleDivider}></div>
      )}
      {/* Body containing the children */}
      {isCollapsed ? (
        <div></div>
      ) : (
        <div className={styles.collapsibleHeaderBody}>{children}</div>
      )}
    </div>
  );
}

Collapsible.propTypes = {
  title: PT.string.isRequired,
  children: PT.node.isRequired,
};
