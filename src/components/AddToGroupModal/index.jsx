import React from "react";
import PT from "prop-types";

import staticData from "../../services/static-data";
import Button from "../Button";
import Group from "./Group";
import Modal from "../Modal";
import { ReactComponent as ZoomIcon } from "../../assets/images/zoom-icon.svg";
import api from "../../services/api";
import { useAuth0 } from "../../react-auth0-spa";
import * as groupLib from "../../lib/groups";

import style from "./style.module.scss";

export default function AddToGroupModal({ onCancel, updateUser, user }) {
  const apiClient = api();
  const { isLoading, isAuthenticated, user: auth0User } = useAuth0();
  const [myGroups, setMyGroups] = React.useState([]);
  const [otherGroups, setOtherGroups] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [selected, setSelected] = React.useState(new Set(user.groups));

  const switchSelected = (group) => {
    const neu = new Set(selected.values());
    if (neu.has(group)) neu.delete(group);
    else neu.add(group);
    setSelected(neu);
  };

  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const groups = await groupLib.getGroups(apiClient, auth0User.nickname);

      setMyGroups(groups.myGroups);
      setOtherGroups(groups.otherGroups);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, auth0User]);

  // const updateOtherGroups = React.useCallback(async () => {
  //   let groups = await staticData.getGroups(filter);
  //   const userGroups = new Set(user.groups);
  //   groups = groups.filter((g) => !userGroups.has(g));
  //   setOtherGroups(groups.slice(0, 4));
  // }, [filter, user]);

  // useEffect(() => {
  //   updateOtherGroups();
  // }, [updateOtherGroups]);

  return (
    <Modal onCancel={onCancel}>
      <h1 className={style.title}>Add to Group</h1>
      <div className={style.searchRow}>
        <ZoomIcon className={style.zoomIcon} />
        <input
          className={style.search}
          onChange={({ target }) => {
            setFilter(target.value);
            setImmediate(() => target.focus());
          }}
          placeholder="Search or create group"
          value={filter}
        />
        <Button
          className={style.createButton}
          onClick={async () => {
            await staticData.createGroup(filter);
            // await updateOtherGroups();
          }}
        >
          + Create
        </Button>
      </div>
      <h3 className={style.subTitle}>My groups</h3>
      <div className={style.groups}>
        {myGroups.map((g) => (
          <Group
            // TODO checked={selected.has(g)}
            group={g}
            key={g.id}
            // TODO onSwitch={() => switchSelected(g)}
          />
        ))}
      </div>
      <h3 className={style.subTitle}>Other Groups</h3>
      <div className={style.groups}>
        {otherGroups.map((g) => (
          <Group
            // TODO checked={selected.has(g)}
            group={g}
            key={g.id}
            // TODO onSwitch={() => switchSelected(g)}
          />
        ))}
      </div>
      <div className={style.buttons}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          className={style.doneButton}
          onClick={async () => {
            onCancel();
            updateUser({
              ...user,
              groups: [...selected],
            });
          }}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}

AddToGroupModal.propTypes = {
  onCancel: PT.func.isRequired,
  updateUser: PT.func.isRequired,
  user: PT.shape().isRequired,
};
