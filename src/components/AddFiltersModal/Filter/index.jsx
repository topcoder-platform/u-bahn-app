import React from 'react';
import PT from 'prop-types';

import Switch from '../../Switch';

import style from './style.module.scss';

export default function Filter({ checked, filter, onSwitch }) {
  return (
    <div className={style.container}> 
      {filter}
      <Switch
        checked={checked}
        className={style.switch}
        onChange={onSwitch}
      />
    </div>
  )
}

Filter.propTypes = {
  checked: PT.bool.isRequired,
  filter: PT.string.isRequired,
  onSwitch: PT.func.isRequired,
}
