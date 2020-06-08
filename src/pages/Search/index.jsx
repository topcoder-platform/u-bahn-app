/**
 * Entire search page assembly.
 */

import React from "react";

import FiltersSideMenu from "../../components/FiltersSideMenu";
import GroupsSideMenu from "../../components/GroupsSideMenu";
import Header, { TABS } from "../../components/Header";
import Pagination from "../../components/Pagination";
import ProfileCard from "../../components/ProfileCard";
import Upload from "../../components/Upload";

import { ReactComponent as DownArrowIcon } from "../../assets/images/down-arrow.svg";
import api from "../../services/api";
import staticData from "../../services/static-data";

import style from "./style.module.scss";
import { useSearch, FILTERS } from "../../lib/search";
import { makeColorIterator, avatarColors } from "../../lib/colors";
import config from "../../config";
import { useAuth0 } from "../../react-auth0-spa";
import helper from "./helper";

const colorIterator = makeColorIterator(avatarColors);

function getOrderByText(orderBy) {
  switch (orderBy) {
    case "location":
      return "Location";
    case "isAvailable":
      return "Availability";
    case config.DEFAULT_SORT_ORDER:
    default:
      return "Name";
  }
}

export default function SearchPage() {
  const apiClient = api();
  const { isLoading, isAuthenticated } = useAuth0();
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [search, setSearch] = React.useState(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [tab, setTab] = React.useState(TABS.SEARCH);
  const [users, setUsers] = React.useState([]);

  const [locations, setLocations] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [achievements, setAchievements] = React.useState([]);
  const [myGroups, setMyGroups] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState([]);

  const [orderBy, setOrderBy] = React.useState(config.DEFAULT_SORT_ORDER);
  const [sortByDropdownShown, setSortByDropdownShown] = React.useState(false);

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  React.useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  });

  const searchContext = useSearch();

  const usersPerPage = searchContext.pagination.perPage;

  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const locations = await staticData.getLocations();
      const skills = await staticData.getSkills();
      const achievements = await staticData.getAchievements();
      const myGroups = await staticData.getMyGroups();
      const allGroups = await staticData.getOtherGroups();

      setLocations(locations);
      setSkills(skills);
      setAchievements(achievements);
      setMyGroups(myGroups);
      setAllGroups(allGroups);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const criteria = {};

      if (
        searchContext.filters[FILTERS.LOCATIONS].active &&
        searchContext.selectedLocations.length > 0
      ) {
        criteria.locations = searchContext.selectedLocations;
      }
      if (
        searchContext.filters[FILTERS.SKILLS].active &&
        searchContext.selectedSkills.length > 0
      ) {
        criteria.skills = searchContext.selectedSkills;
      }
      if (
        searchContext.filters[FILTERS.ACHIEVEMENTS].active &&
        searchContext.selectedAchievements.length > 0
      ) {
        criteria.achievements = searchContext.selectedAchievements;
      }
      if (searchContext.filters[FILTERS.AVAILABILITY].active) {
        if (
          searchContext.selectedAvailability &&
          ("isAvailableSelected" in searchContext.selectedAvailability ||
            "isUnavailableSelected" in searchContext.selectedAvailability)
        ) {
          const availabilityFilter = searchContext.selectedAvailability;
          if (
            availabilityFilter.isAvailableSelected &&
            !availabilityFilter.isUnavailableSelected
          ) {
            criteria.isAvailable = true;
          } else if (
            !availabilityFilter.isAvailableSelected &&
            availabilityFilter.isUnavailableSelected
          ) {
            criteria.isAvailable = false;
          }
        }
      }
      if (searchContext.pagination.page !== page) {
        setPage(page);
      }

      setIsSearching(true);
      setUsers([]);

      const { url, options } = helper.getSearchUsersRequestDetails({
        search: search,
        criteria,
        page: searchContext.pagination.page,
        limit: searchContext.pagination.perPage,
        orderBy,
      });

      let { headers, data } = await apiClient.get(url, options);

      setIsSearching(false);

      // Set the profile background color for each user
      data.forEach((u) => {
        const nextColor = colorIterator.next();
        u.avatarColor = nextColor.value;
      });

      setUsers(data);
      setTotalResults(Number(headers["x-total"]));
      setTotalPages(Number(headers["x-total-pages"]));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, search, orderBy, searchContext]);

  // if (tab === TABS.GROUPS) {
  //   const currentGroup = (groups.find(g => g.current) || {}).name;
  //   if (currentGroup) {
  //     filteredUsers = filteredUsers.filter(
  //       user => user.groups && user.groups.includes(currentGroup)
  //     );
  //   }
  // }

  const handleSort = (attr) => {
    setOrderBy(attr);
  };

  let mainContent;

  if (isLoading || !isAuthenticated) {
    mainContent = null;
  }

  switch (tab) {
    case TABS.SEARCH:
    case TABS.GROUPS:
      mainContent = (
        <>
          <div className={style.sideMenu}>
            {tab === TABS.SEARCH ? (
              <FiltersSideMenu
                locations={locations}
                skills={skills}
                achievements={achievements}
              />
            ) : (
              <GroupsSideMenu userGroups={myGroups} allGroups={allGroups} />
            )}
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
                <div
                  className={style.sort}
                  onClick={() => setSortByDropdownShown(!sortByDropdownShown)}
                  style={{
                    marginRight:
                      windowWidth > 1280
                        ? windowWidth -
                          460 -
                          Math.floor((windowWidth - 460) / 392) * 392
                        : 0,
                  }}
                >
                  Sort by
                  {!!orderBy && (
                    <span className={style.sortMode}>
                      {getOrderByText(orderBy)}
                    </span>
                  )}
                  <DownArrowIcon />
                  {sortByDropdownShown && (
                    <ul className={style.dropdown}>
                      <li
                        className={style.dropdownItem}
                        onClick={() => handleSort("name")}
                      >
                        Name
                      </li>
                      <li
                        className={style.dropdownItem}
                        onClick={() => handleSort("location")}
                      >
                        Location
                      </li>
                      <li
                        className={style.dropdownItem}
                        onClick={() => handleSort("isAvailable")}
                      >
                        Availability
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              <div>
                {users.map((user, index) => {
                  return (
                    <ProfileCard
                      key={"profile-" + user.id}
                      profile={user}
                      avatarColor={user.avatarColor}
                    />
                  );
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
                  No users found. Try applying a different filter.
                </div>
              </div>
            </div>
          )}
        </>
      );
      break;
    case TABS.UPLOADS:
      mainContent = (
        <Upload templateId={config.BULK_UPLOAD_TEMPLATE_ID} api={apiClient} />
      );
      break;
    default:
      throw Error("Invalid tab");
  }

  return (
    <div>
      <Header
        currentTab={tab}
        onTabChange={setTab}
        onSearch={setSearch}
        organizationId="DummyOrg"
      />
      <div className={style.mainArea}>{mainContent}</div>
    </div>
  );
}
