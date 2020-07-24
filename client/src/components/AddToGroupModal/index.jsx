import React from "react";
import PT from "prop-types";

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
  const [creatingGroup, setCreatingGroup] = React.useState(false);

  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const groups = await groupLib.getGroups(apiClient, auth0User.nickname);

      groups.myGroups.forEach((g, i, a) => {
        userGroups.forEach((ug, iug, aug) => {
          if (g.id === ug.id && !ug.isDeleted) {
            a[i] = { ...g, isSelected: true };
          }
        });
      });

      groups.otherGroups.forEach((g, i, a) => {
        userGroups.forEach((ug, iug, aug) => {
          if (g.id === ug.id && !ug.isDeleted) {
            a[i] = { ...g, isSelected: true };
          }
        });
      });

      setMyGroups(groups.myGroups);
      setOtherGroups(groups.otherGroups);
      setIsLoadingGroups(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, auth0User]);

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

  /**
   * Creates a new group
   */
  const createGroup = async () => {
    const groupName = filter.trim();
    if (groupName.length === 0) {
      alert("Enter a group name");
      return;
    }

    setCreatingGroup(true);

    const newGroup = await groupLib.createGroup(apiClient, groupName);

    if (newGroup.id) {
      const newOtherGroups = JSON.parse(JSON.stringify(otherGroups));

      newOtherGroups.push(newGroup);

      setOtherGroups(newOtherGroups);

      alert(`Group with name ${groupName} created successfully`);

      setFilter("");
    } else {
      alert("Group creation failed");
    }

    setCreatingGroup(false);
  };

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
          disabled={loadingGroups}
        />
        <Button
          className={style.createButton}
          onClick={createGroup}
          disabled={creatingGroup}
        >
          {creatingGroup ? "Creating..." : "+ Create"}
        </Button>
      </div>
      <h3 className={style.subTitle}>
        My groups{loadingGroups && " (Loading...)"}
      </h3>
      <div className={style.groups}>
        {!loadingGroups &&
          myGroups
            .filter((g) => g.name.toLowerCase().includes(filter.toLowerCase()))
            .map((g) => (
              <Group
                checked={g.isSelected === true}
                group={g}
                key={g.id}
                onSwitch={() => switchSelected(g)}
              />
            ))}
      </div>
      {myGroups.filter((g) => g.name.toLowerCase().includes(filter.toLowerCase())).length === 0 && !loadingGroups && <div>No results found</div>}
      <h3 className={style.subTitle}>
        Other Groups{loadingGroups && " (Loading...)"}
      </h3>
      <div className={style.groups}>
        {!loadingGroups &&
          otherGroups
            .filter((g) => g.name.toLowerCase().includes(filter.toLowerCase()))
            .map((g) => (
              <Group
                checked={g.isSelected === true}
                group={g}
                key={g.id}
                onSwitch={() => switchSelected(g)}
              />
            ))}
      </div>
      {otherGroups.filter((g) => g.name.toLowerCase().includes(filter.toLowerCase())).length === 0 && !loadingGroups && <div>No results found</div>}
      <div className={style.buttons}>
        <Button onClick={onCancel} disabled={updatingGroups || creatingGroup}>
          Cancel
        </Button>
        <Button
          disabled={updatingGroups || creatingGroup}
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
