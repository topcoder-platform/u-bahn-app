import React from "react";
import PT from "prop-types";

import style from "./style.module.scss";

export default function Pill({ className, name, onRemove, removable }) {
  let containerStyle = style.container;
  if (className) containerStyle += ` ${className}`;
  return (
    <div className={containerStyle}>
      <div title={name} className="pillName">
        {name}
      </div>
      {removable ? (
        <button className={style.close} onClick={onRemove}>
          &times;
        </button>
      ) : null}
    </div>
  );
}

Pill.propTypes = {
  className: PT.string,
  name: PT.string.isRequired,
  onRemove: PT.func,
  removable: PT.bool,
};

Pill.defaultProps = {
  removable: true,
};
