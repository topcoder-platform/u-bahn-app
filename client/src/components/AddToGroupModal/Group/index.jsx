import React from "react";
import PT from "prop-types";

import Switch from "../../Switch";

import style from "./style.module.scss";

export default function Group({ checked, group, onSwitch }) {
  return (
    <div className={style.container}>
      <div title={group.name} className={style.groupName}>
        {group.name}
      </div>
      <Switch checked={checked} className={style.switch} onChange={onSwitch} />
    </div>
  );
}

Group.propTypes = {
  // TODO checked: PT.bool.isRequired,
  group: PT.shape().isRequired,
  onSwitch: PT.func.isRequired,
};
