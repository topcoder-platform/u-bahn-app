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
import * as helper from "./helper";
import * as groupLib from "../../lib/groups";
import { getCompanyAttributes } from "../../lib/company-attributes";

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
  const isCompanyAttrFilterFirstLoad = React.useRef(false);
  const apiClient = api();
  const { isLoading, isAuthenticated, user: auth0User } = useAuth0();
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [search, setSearch] = React.useState(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [tab, setTab] = React.useState(TABS.SEARCH);
  const [users, setUsers] = React.useState([]);

  const [locations, setLocations] = React.useState([]);
  const [achievements, setAchievements] = React.useState([]);
  const [myGroups, setMyGroups] = React.useState([]);
  const [otherGroups, setOtherGroups] = React.useState([]);

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

  // Static data only
  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const locations = await staticData.getLocations();
      const achievements = await staticData.getAchievements();

      setLocations(locations);
      setAchievements(achievements);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  // Non-static data and Non-user related data
  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      const groups = await groupLib.getGroups(apiClient, auth0User.nickname);
      const companyAttrs = await getCompanyAttributes(apiClient, auth0User);
      const filtersWithCompanyAttrs = { ...searchContext.filters };
      companyAttrs.forEach((companyAttr) => {
        filtersWithCompanyAttrs[companyAttr.id] = {
          text: companyAttr.name,
          group: "Company attributes",
          active: false,
        };
      });
      isCompanyAttrFilterFirstLoad.current = true;

      searchContext.setFilters(filtersWithCompanyAttrs);
      setMyGroups(groups.myGroups);
      setOtherGroups(groups.otherGroups);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, auth0User]);

  // Only user related data (search)
  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    (async () => {
      // The if is to prevent another user load after company attributes are loaded
      if (!isCompanyAttrFilterFirstLoad.current) {
        const criteria = {};
        let headers;
        let data;

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

        criteria.attributes = [];
        searchContext.getCompanyAttrActiveFilter().forEach((filter) => {
          if (
            searchContext.selectedCompanyAttributes[filter.id] &&
            searchContext.selectedCompanyAttributes[filter.id].length > 0
          ) {
            criteria.attributes.push({
              id: filter.id,
              value: searchContext.selectedCompanyAttributes[filter.id].map(
                (data) => data.value
              ),
            });
          }
        });

        if (searchContext.pagination.page !== page) {
          setPage(page);
        }

        setIsSearching(true);
        setUsers([]);

        const { url, options, body } = helper.getSearchUsersRequestDetails({
          search: search,
          criteria,
          page: searchContext.pagination.page,
          limit: searchContext.pagination.perPage,
          orderBy,
        });

        try {
          let response = await apiClient.post(url, body, options);

          headers = response.headers;
          data = response.data;
        } catch (error) {
          headers = {};
          data = [];
          // TODO handle error
        }

        setIsSearching(false);

        // Set the profile background color for each user
        data.forEach((u) => {
          const nextColor = colorIterator.next();
          u.avatarColor = nextColor.value;
        });

        setUsers(data);
        setTotalResults(Number(headers["x-total"]));
        setTotalPages(Number(headers["x-total-pages"]));
      } else {
        isCompanyAttrFilterFirstLoad.current = false;
      }
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
                achievements={achievements}
              />
            ) : (
              <GroupsSideMenu userGroups={myGroups} otherGroups={otherGroups} />
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
