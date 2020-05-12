import React from 'react';
import PT from 'prop-types';

import Button from '../../Button';

import style from './style.module.scss';

export default function Progress({ onAbort, progress }) {
  return (
    <div className={style.container}>
      <div>Uploading profiles...</div>
      <div className={style.progress}>
        <div
          className={style.filler}
          style={{ width: `${100 * progress}%`}}
        />
      </div>
      <Button onClick={onAbort}>Abort</Button>
    </div>
  );
}

Progress.propTypes = {
  onAbort: PT.func.isRequired,
  progress: PT.number,
};

Progress.defaultProps = {
  progress: 0,
};
