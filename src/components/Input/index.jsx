import React from 'react';
import PT from 'prop-types';

import style from './style.module.scss';

export default function Input({
  className,
  label,
  onChange,
  value,
}) {
  let containerStyle = style.container;
  if (className) containerStyle += ` ${className}`;

  return (
    <div className={containerStyle}>
      <div className={style.label}>{label}</div>
      <input className={style.input} onChange={onChange} value={value} />
    </div>
  )
}

Input.propTypes = {
  className: PT.string,
  label: PT.string,
  onChange: PT.func,
  value: PT.string,
};
