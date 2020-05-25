import React from "react";
import PT from "prop-types";

import style from "./style.module.scss";

export default function Switch({ checked, className, label, onChange }) {
  let containerStyle = style.container;
  if (className) containerStyle += ` ${className}`;
  if (checked) containerStyle += ` ${style.checked}`;

  return (
    <div className={containerStyle}>
      {label === undefined ? null : <div className={style.label}>{label}</div>}
      <label className={style.switch}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <i></i>
      </label>
    </div>
  );
}

Switch.propTypes = {
  checked: PT.bool,
  className: PT.string,
  lable: PT.string,
  onChange: PT.func,
};
