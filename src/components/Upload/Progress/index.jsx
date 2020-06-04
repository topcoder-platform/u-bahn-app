import React from "react";
import PT from "prop-types";

import style from "./style.module.scss";

export default function Progress({ progress }) {
  return (
    <div className={style.container}>
      <div>Uploading profiles...</div>
      <div className={style.progress}>
        <div className={style.filler} style={{ width: `${100 * progress}%` }} />
      </div>
    </div>
  );
}

Progress.propTypes = {
  progress: PT.number,
};

Progress.defaultProps = {
  progress: 0,
};
