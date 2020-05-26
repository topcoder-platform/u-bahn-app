/**
 * Container of upload & upload result components.
 */

import React from "react";
import PT from "prop-types";

import emptyCard from "../../../assets/images/empty-card.svg";

import style from "./style.module.scss";

function DecorativeCard() {
  return (
    <img
      alt="Decorative empty card"
      className={style.decorativeCard}
      src={emptyCard}
    />
  );
}

export default function Container({ children }) {
  return (
    <div className={style.container}>
      <div className={style.decorations}>
        <DecorativeCard />
        <DecorativeCard />
        <DecorativeCard />
      </div>
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PT.node,
};
