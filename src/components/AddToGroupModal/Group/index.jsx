import React from 'react';
import PT from 'prop-types';

import Switch from '../../Switch';

import style from './style.module.scss';

export default function Group({ checked, group, onSwitch }) {
  return (
    <div className={style.container}> 
      {group}
      <Switch
        checked={checked}
        className={style.switch}
        onChange={onSwitch}
      />
    </div>
  )
}

Group.propTypes = {
  checked: PT.bool.isRequired,
  group: PT.string.isRequired,
  onSwitch: PT.func.isRequired,
}
