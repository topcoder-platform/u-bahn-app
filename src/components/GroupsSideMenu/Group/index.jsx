import React from 'react';
import PT from 'prop-types';

import { ReactComponent as DownArrow }
  from '../../../assets/images/down-arrow.svg';

import style from './style.module.scss';

export default function Group({
  count,
  current,
  name,
  onClick,
}) {
  let containerStyle = style.container;
  if (current) containerStyle += ` ${style.current}`;
  return (
    <div className={containerStyle} onClick={onClick}>
      <div className={style.name}>{name}</div>
      <div className={style.count}>
        {count}
        <DownArrow className={style.arrow} />
      </div>
    </div>
  );
}

Group.propTypes = {
  count: PT.number,
  current: PT.bool,
  name: PT.string.isRequired,
  onClick: PT.func,
};
