import React from 'react';
import PT from 'prop-types';

import style from './style.module.scss';

export default function AddGroup({ onClick }) {
  return (
    <div
      className={style.button}
      onClick={onClick}
    >
      +
    </div>
  );
}

AddGroup.propTypes = {
  onClick: PT.func.isRequired,
};
