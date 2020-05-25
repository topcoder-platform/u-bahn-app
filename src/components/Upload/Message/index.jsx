import React from "react";
import PT from "prop-types";

import Button from "../../Button";

import style from "./style.module.scss";

export default function Message({ message, onClose, title }) {
  return (
    <div className={style.container}>
      <h1 className={style.title}>{title}</h1>
      <div className={style.message}>{message}</div>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
}

Message.propTypes = {
  message: PT.node.isRequired,
  onClose: PT.func.isRequired,
  title: PT.string.isRequired,
};
