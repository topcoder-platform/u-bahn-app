import React from 'react';
import PT from 'prop-types';

import { ReactComponent as DownIcon } from '../../assets/images/down-arrow.svg';

import style from './style.module.scss';

export default function FilterGroup({
  children,
  title,
}) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className={style.container}>
      <div className={style.title}>
        {title}
        <DownIcon
          className={`${style.switch} ${open ? '' : style.closed}`}
          onClick={() => setOpen(!open)}
        />
      </div>
      {
        open ? (
          <div className={style.content}>
            {children}
          </div>
        ) : null
      }
    </div>
  );
}

FilterGroup.propTypes = {
  children: PT.node,
  title: PT.string.isRequired,
};
