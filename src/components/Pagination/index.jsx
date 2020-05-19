import React from 'react';
import PT from 'prop-types';

import style from './style.module.scss';

export default function Pagination({
  currentPage,
  byPage,
  numPages,
  onPage,
}) {
  const buttons = [(
    <button
      className={`${style.button} ${currentPage === 1 ? style.disabled : ''}`}
      disabled={currentPage === 1}
      onClick={() => onPage(currentPage - 1)}
      key="previous"
    >
      &larr;
    </button>
  )];
  if (currentPage > 3) {
    buttons.push((
      <span
        className={style.disabled}
        disabled={true}
        key="after-previous"
      >
        ...
      </span>
    ));
  }
  for (let i = 1, p = currentPage > 2? currentPage - 2 : currentPage > 1? currentPage - 1 : currentPage; i < 6 && p < numPages / byPage + 1; ++i, ++p) {
    let buttonStyle = style.button;
    if (p === currentPage) buttonStyle += ` ${style.current}`;
    buttons.push((
      <button
        className={buttonStyle}
        disabled={p === currentPage}
        key={p}
        onClick={() => onPage(p)}
      >
        {p}
      </button>
    ));
  }
  if (currentPage < numPages / byPage - 2) {
    buttons.push((
      <span
        className={style.disabled}
        disabled={true}
        key="pre-next"
      >
        ...
      </span>
    ));
  }
  buttons.push((
    <button
      className={
        `${style.button} ${currentPage === numPages / byPage ? style.disabled : ''}`
      }
      disabled={currentPage === numPages / byPage}
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
  byPage: PT.number.isRequired,
  numPages: PT.number.isRequired,
  onPage: PT.func.isRequired,
};
