import React from 'react';
import PT from 'prop-types';

import { ReactComponent as ZoomIcon } from '../../assets/images/zoom-icon.svg';

import style from './style.module.scss';

export default function Search({
  className,
  onChange,
  placeholder,
}) {
  let containerStyle = style.container;
  if (className) containerStyle += ` ${className}`;
  return (
    <div className={containerStyle}>
      <ZoomIcon />
      <input
        className={style.input}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

Search.propTypes = {
  className: PT.string,
  onChange: PT.func,
  placeholder: PT.string,
};
