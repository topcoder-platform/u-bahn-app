import React from "react";
import PT from "prop-types";

import style from "./style.module.scss";
import { useSearch } from "../../lib/search";

export default function Pagination({ currentPage, numPages, onChangePage }) {
  const search = useSearch();

  const changePage = (newPageNumber) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (onChangePage) {
      onChangePage(newPageNumber);
      return;
    }

    search.changePageNumber(newPageNumber);
  };

  const buttons = [
    <button
      className={`${style.button} ${currentPage === 1 ? style.disabled : ""}`}
      disabled={currentPage === 1}
      onClick={() => changePage(currentPage - 1)}
      key="previous"
    >
      &larr;
    </button>,
  ];
  if (currentPage > 3) {
    buttons.push(
      <span className={style.disabled} disabled={true} key="after-previous">
        ...
      </span>
    );
  }
  for (
    let i = 1,
      p =
        currentPage > 2
          ? currentPage - 2
          : currentPage > 1
          ? currentPage - 1
          : currentPage;
    i < 6 && p < numPages + 1;
    ++i, ++p
  ) {
    let buttonStyle = style.button;
    if (p === currentPage) buttonStyle += ` ${style.current}`;
    buttons.push(
      <button
        className={buttonStyle}
        disabled={p === currentPage}
        key={p}
        onClick={() => changePage(p)}
      >
        {p}
      </button>
    );
  }
  if (currentPage < numPages - 2) {
    buttons.push(
      <span className={style.disabled} disabled={true} key="pre-next">
        ...
      </span>
    );
  }
  buttons.push(
    <button
      className={`${style.button} ${
        currentPage === numPages ? style.disabled : ""
      }`}
      disabled={currentPage === numPages}
      onClick={() => changePage(currentPage + 1)}
      key="next"
    >
      &rarr;
    </button>
  );

  return <div className={style.container}>{buttons}</div>;
}

Pagination.propTypes = {
  currentPage: PT.number.isRequired,
  numPages: PT.number.isRequired,
  onChangePage: PT.func,
};
