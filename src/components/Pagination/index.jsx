import React from 'react';
import PT from 'prop-types';

import style from './style.module.scss';

export default function Pagination({
  currentPage,
  numPages,
  onPage,
}) {
  const buttons = [(
    <button
      className={`${style.button} ${currentPage ? '' : style.disabled}`}
      disabled={!currentPage}
      onClick={() => onPage(currentPage - 1)}
      key="previous"
    >
      &larr;
    </button>
  )];
  for (let i = 0; i < numPages; ++i) {
    let buttonStyle = style.button;
    if (i === currentPage) buttonStyle += ` ${style.current}`;
    buttons.push((
      <button
        className={buttonStyle}
        disabled={i === currentPage}
        key={i}
        onClick={() => onPage(i)}
      >
        {1 + i}
      </button>
    ));
  }
  buttons.push((
    <button
      className={
        `${style.button} ${currentPage === numPages - 1 ? style.disabled : ''}`
      }
      disabled={currentPage === numPages - 1}
      onClick={() => onPage(currentPage + 1)}
      key="next"
    >
      &rarr;
    </button>
  ));

  return (
    <div className={style.container}>
      {buttons}
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PT.number.isRequired,
  numPages: PT.number.isRequired,
  onPage: PT.func.isRequired,
};
