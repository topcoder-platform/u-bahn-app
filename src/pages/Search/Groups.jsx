import React from "react";
import GroupsSideMenu from "../../components/GroupsSideMenu";
import ProfileCardGroupWrapper from "../../components/ProfileCardGroupWrapper";
import Pagination from "../../components/Pagination";

import { makeColorIterator, avatarColors } from "../../lib/colors";
import { useAuth0 } from "../../react-auth0-spa";
import config from "../../config";
import api from "../../services/api";
import * as groupLib from "../../lib/groups";

import style from "./style.module.scss";

const colorIterator = makeColorIterator(avatarColors);

export default function SearchGroups() {
  const apiClient = api();
  const { user: auth0User } = useAuth0();
  const [myGroups, setMyGroups] = React.useState([]);
  const [otherGroups, setOtherGroups] = React.useState([]);
  const [loadingGroups, setLoadingGroups] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [creatingGroup, setCreatingGroup] = React.useState(false);

  const usersPerPage = config.ITEMS_PER_PAGE;

  React.useEffect(() => {
    setLoadingGroups(true);

    (async () => {
      const groups = await groupLib.getGroups(apiClient, auth0User.nickname);

      setMyGroups(groups.myGroups);
      setOtherGroups(groups.otherGroups);
      setLoadingGroups(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Retrieves the members of the group on selection
   * @param {Object} group The selected group
   */
  const onGroupSelected = async (group) => {
    let headers;
    let data;

    setSelectedGroup(group);
    setIsSearching(true);
    setUsers([]);

    // Reset pagination
    setPage(1);

    try {
      const url = `${config.GROUPS_API_URL}/${group.id}/members`;
      const response = await apiClient.get(url);

      headers = response.headers;
      data = response.data;
    } catch (error) {
      console.log(error);
      headers = {};
      data = [];
      // TODO handle error
    }

    data.forEach((u) => {
      const nextColor = colorIterator.next();
      u.avatarColor = nextColor.value;
    });

    // Check that we are still in the group tab
    setUsers(data);
    setTotalResults(Number(headers["x-total"]));
    setTotalPages(Number(headers["x-total-pages"]));
    setIsSearching(false);
  };

  /**
   * Creates a new group
   * @param {String} groupName The name of the group to create
   */
  const createGroup = async (groupName) => {
    if (!groupName || groupName.length === 0) {
      return;
    }

    setCreatingGroup(true);

    const newGroup = await groupLib.createGroup(
      apiClient,
      auth0User.nickname,
      groupName
    );

    if (newGroup.id) {
      const newOtherGroups = JSON.parse(JSON.stringify(otherGroups));

      newOtherGroups.push({ ...newGroup, count: 0 });

      setOtherGroups(newOtherGroups);
      alert(`Group with name ${groupName} created successfully`);
    } else {
      alert("Group creation failed");
    }

    setCreatingGroup(false);
  };

  return (
    <>
      <div className={style.sideMenu}>
        <GroupsSideMenu
          userGroups={myGroups}
          otherGroups={otherGroups}
          loadingGroups={loadingGroups}
          onGroupSelected={onGroupSelected}
          creatingGroup={creatingGroup}
          onCreateNewGroup={createGroup}
        />
      </div>
      {!isSearching && users.length > 0 && (
        <div className={style.rightSide}>
          <div className={style.cardsHeader}>
            <div className={style.visibleCardsInfo}>
              Showing {usersPerPage * page - (usersPerPage - 1)}-
              {usersPerPage * page > totalResults
                ? totalResults
                : usersPerPage * page}{" "}
              of {totalResults} profiles
            </div>
          </div>
          <div>
            {users.map((user) => {
              return <ProfileCardGroupWrapper user={user} key={user.id} />;
            })}
          </div>
          <div>
            <Pagination
              currentPage={page}
              itemsPerPage={usersPerPage}
              numPages={totalPages}
            />
          </div>
        </div>
      )}
      {isSearching && (
        <div className={style.rightSide}>
          <div className={style.cardsHeader}>
            <div className={style.visibleCardsInfo}>
              Loading users. This can take some time. Please wait...
            </div>
          </div>
        </div>
      )}
      {!isSearching && users.length === 0 && (
        <div className={style.rightSide}>
          <div className={style.cardsHeader}>
            <div className={style.visibleCardsInfo}>
              {selectedGroup
                ? "No users found. Try selecting a different group."
                : "Select a group to get the members of that group."}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
