import React, { useEffect } from "react";
import { List } from "react-virtualized";
import PT from "prop-types";

import Button from "../Button";
import Group from "./Group";
import Modal from "../Modal";
import { ReactComponent as ZoomIcon } from "../../assets/images/zoom-icon.svg";
import api from "../../services/api";
import { useAuth0 } from "../../react-auth0-spa";
import * as groupLib from "../../lib/groups";

import style from "./style.module.scss";
import Axios from "axios";

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
  const cancelTokenSource = Axios.CancelToken.source();

  /**
   * Component unmount trigger
   */
  useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  });

  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const groups = await groupLib.getGroups(
        apiClient,
        auth0User.nickname,
        cancelTokenSource.token
      );

      if (groups) {
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
      }
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
    if (groupName.length < 3) {
      alert("Group name must be more than three characters");
      return;
    }
    if (groupName.length > 150) {
      alert("Group name cannot exceed 150 characters");
      return;
    }

    setCreatingGroup(true);

    const newGroup = await groupLib.createGroup(apiClient, groupName);

    if (newGroup && newGroup.id) {
      const newOtherGroups = JSON.parse(JSON.stringify(otherGroups));

      newOtherGroups.push(newGroup);

      setOtherGroups(newOtherGroups);

      alert(`Group with name ${groupName} created successfully`);

      setFilter("");
    } else if (newGroup.message) {
      alert(newGroup.message);
    } else {
      alert("Group creation failed");
    }

    setCreatingGroup(false);
  };

  const reset = () => {
    setFilter("");
  };

  const filteredOtherGroups = otherGroups.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase())
  );
  const filteredMyGroups = myGroups.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase())
  );

  const myGroupsListEstimatedWidth = filteredMyGroups.length > 10 ? 540 : 560;
  const otherGroupsListEstimatedWidth =
    filteredOtherGroups.length > 10 ? 540 : 560;
  const listWidth =
    myGroupsListEstimatedWidth > otherGroupsListEstimatedWidth
      ? myGroupsListEstimatedWidth
      : otherGroupsListEstimatedWidth;

  /**
   * Row renderer for react-virtualized#List.
   * Renders each item as a row.
   * @param {String} key unique key for the item
   * @param {Number} index index of the item (row)
   * @param {Object} style
   * @return {SectionRow} row element
   */
  function rowRenderer({ key, index, style, items }) {
    return (
      <div key={key} style={style}>
        <Group
          checked={items[index].isSelected === true}
          group={items[index]}
          key={items[index].id}
          onSwitch={() => switchSelected(items[index])}
        />
      </div>
    );
  }

  return (
    <Modal
      onCancel={onCancel}
      className={style.container}
      overlayClassName={style.overlay}
    >
      <h1 className={style.title}>Add to Group</h1>
      <div className={style.groups}>
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
          <span
            className={
              filter.length > 0
                ? `${style.resetKeyword}`
                : `${style.resetKeyword} ${style.resetKeywordHidden}`
            }
            onClick={() => reset()}
          >
            &times;
          </span>
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
        <div>
          {!loadingGroups && (
            <List
              className={style.groupsList}
              width={listWidth}
              height={
                filteredMyGroups.length > 10
                  ? 450
                  : filteredMyGroups.length * 45
              }
              rowCount={filteredMyGroups.length}
              rowHeight={45}
              rowRenderer={(params) =>
                rowRenderer({ ...params, items: filteredMyGroups })
              }
            />
          )}
        </div>
        {myGroups.filter((g) =>
          g.name.toLowerCase().includes(filter.toLowerCase())
        ).length === 0 &&
          !loadingGroups && (
            <div className={style.message}>No results found</div>
          )}
        <h3 className={style.subTitle}>
          Other Groups{loadingGroups && " (Loading...)"}
        </h3>
        <div>
          {!loadingGroups && (
            <List
              className={style.groupsList}
              width={listWidth}
              height={
                filteredOtherGroups.length > 10
                  ? 450
                  : filteredOtherGroups.length * 45
              }
              rowCount={filteredOtherGroups.length}
              rowHeight={45}
              rowRenderer={(params) =>
                rowRenderer({ ...params, items: filteredOtherGroups })
              }
            />
          )}
        </div>
        {otherGroups.filter((g) =>
          g.name.toLowerCase().includes(filter.toLowerCase())
        ).length === 0 &&
          !loadingGroups && (
            <div className={style.message}>No results found</div>
          )}
      </div>
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
