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
  const [loadingGroups, setIsLoadingGroups] = React.useState(true);
  const { isLoading, isAuthenticated, user: auth0User } = useAuth0();
  const [myGroups, setMyGroups] = React.useState([]);
  const [otherGroups, setOtherGroups] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [updatingGroups, setUpdatingGroups] = React.useState(false);
  const [userGroups, setUserGroups] = React.useState(user.groups);

  const switchSelected = async (toggledGroup) => {
    let updatedGroup;
    let index = myGroups.findIndex((group) => group.id === toggledGroup.id);

    if (index === -1) {
      index = otherGroups.findIndex((group) => group.id === toggledGroup.id);

      updatedGroup = JSON.parse(JSON.stringify(otherGroups));

      updatedGroup[index].isSelected = !updatedGroup[index].isSelected;

      setOtherGroups(updatedGroup);
    } else {
      updatedGroup = JSON.parse(JSON.stringify(myGroups));

      updatedGroup[index].isSelected = !updatedGroup[index].isSelected;

      setMyGroups(updatedGroup);
    }

    index = userGroups.findIndex((group) => group.id === toggledGroup.id);

    if (index === -1) {
      updatedGroup = JSON.parse(JSON.stringify(userGroups));

      updatedGroup.push({ ...toggledGroup, isNew: true });
    } else {
      updatedGroup = JSON.parse(JSON.stringify(userGroups));

      if (updatedGroup[index].isNew) {
        // Was added previously. If toggled, it would mean we don't add it
        updatedGroup.splice(index, 1);
      } else if (updatedGroup[index].isDeleted) {
        // Was deleted previously. If toggled, it would mean we don't remove it
        delete updatedGroup[index].isDeleted;
      } else {
        // Exists on the user. If toggled, it would mean we need to remove it
        updatedGroup[index].isDeleted = true;
      }
    }

    setUserGroups(updatedGroup);
  };

  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const groups = await groupLib.getGroups(apiClient, auth0User.nickname);

      setMyGroups(groups.myGroups);
      setOtherGroups(groups.otherGroups);
      setIsLoadingGroups(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, auth0User]);

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
            // TODO - await updateOtherGroups();
          }}
        >
          + Create
        </Button>
      </div>
      <h3 className={style.subTitle}>
        My groups{loadingGroups && " (Loading...)"}
      </h3>
      <div className={style.groups}>
        {!loadingGroups &&
          myGroups.map((g) => (
            <Group
              checked={g.isSelected === true}
              group={g}
              key={g.id}
              onSwitch={() => switchSelected(g)}
            />
          ))}
      </div>
      <h3 className={style.subTitle}>
        Other Groups{loadingGroups && " (Loading...)"}
      </h3>
      <div className={style.groups}>
        {loadingGroups &&
          otherGroups.map((g) => (
            <Group
              checked={g.isSelected === true}
              group={g}
              key={g.id}
              onSwitch={() => switchSelected(g)}
            />
          ))}
      </div>
      <div className={style.buttons}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          disabled={updatingGroups}
          className={
            updatingGroups ? style.doneDisabledButton : style.doneButton
          }
          onClick={async () => {
            setUpdatingGroups(true);
            updateUser({
              ...user,
              groups: userGroups,
            });
          }}
        >
          {updatingGroups ? "Saving changes made..." : "Done"}
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
