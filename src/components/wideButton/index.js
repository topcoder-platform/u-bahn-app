import React from "react";
import PT from "prop-types";
import styles from "./wideButton.module.css";

export default function WideButton({ text, action }) {
  return (
    <button className={styles.wideButton} onClick={action}>
      {text}
    </button>
  );
}

WideButton.propTypes = {
  text: PT.string.isRequired,
  action: PT.func,
};
