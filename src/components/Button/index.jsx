import React from 'react';
import PT from 'prop-types';

import style from './style.module.scss';

export default function Button({
  children,
  className,
  onClick,
}) {
  let clazz = style.button;
  if (className) clazz += ` ${className}`;
  return (
    <button className={clazz} onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PT.string,
  className: PT.string,
  onClick: PT.func,
}

Button.defaultProps = {
  children: 'Button',
};
