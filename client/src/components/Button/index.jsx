import React from "react";
import PT from "prop-types";

import style from "./style.module.scss";

export default function Button({ children, className, onClick, disabled }) {
  let clazz = style.button;
  if (className) clazz += ` ${className}`;
  return (
    <button className={clazz} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PT.string,
  className: PT.string,
  onClick: PT.func,
  disabled: PT.bool,
};

Button.defaultProps = {
  children: "Button",
  disabled: false,
};
