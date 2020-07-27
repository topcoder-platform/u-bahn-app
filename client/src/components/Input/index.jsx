import React from "react";
import PT from "prop-types";
import _ from "lodash";

import style from "./style.module.scss";

export default function Input({ className, label, onChange, value }) {
  let containerStyle = style.container;
  if (className) containerStyle += ` ${className}`;
  const id = _.uniqueId("input_");

  return (
    <div className={containerStyle}>
      <label htmlFor={id} className={style.label}>
        {label}
      </label>
      <input
        id={id}
        className={style.input}
        onChange={onChange}
        onKeyDown={(event) => {
          if (event.keyCode === 8) {
            event.preventDefault();
            event.currentTarget.value = event.currentTarget.value.slice(0, -1);
          }
        }}
        value={value}
      />
    </div>
  );
}

Input.propTypes = {
  className: PT.string,
  label: PT.string,
  onChange: PT.func,
  value: PT.string,
};
