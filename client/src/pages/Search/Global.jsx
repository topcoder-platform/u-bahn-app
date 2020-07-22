import React from "react";
import PT from "prop-types";
import axios from "axios";
import FiltersSideMenu from "../../components/FiltersSideMenu";
import { ReactComponent as DownArrowIcon } from "../../assets/images/down-arrow.svg";
import ProfileCard from "../../components/ProfileCard";
import Pagination from "../../components/Pagination";

import * as helper from "./helper";
import { useAuth0 } from "../../react-auth0-spa";
import { getCompanyAttributes } from "../../lib/company-attributes";
import { useSearch, FILTERS } from "../../lib/search";
import { makeColorIterator, avatarColors } from "../../lib/colors";
import config from "../../config";
import api from "../../services/api";
import staticData from "../../services/static-data";

import style from "./style.module.scss";

const colorIterator = makeColorIterator(avatarColors);

/**
 * Converts the internal identifier for the sort order to one suitable for display
 * @param {String} orderBy The internal identifier for the sort order
 */
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

export default function SearchGlobal({ keyword }) {
  const { isLoading, isAuthenticated, user: auth0User } = useAuth0();
  const apiClient = api();
  const searchContext = useSearch();
  const [isSearching, setIsSearching] = React.useState(false);
  const [locations, setLocations] = React.useState([]);
  const [achievements, setAchievements] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [sortByDropdownShown, setSortByDropdownShown] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [orderBy, setOrderBy] = React.useState(config.DEFAULT_SORT_ORDER);
  const [totalPages, setTotalPages] = React.useState(0);

  const usersPerPage = config.ITEMS_PER_PAGE;

  React.useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  });

  // Static data only
  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    let isSubscribed = true;

    (async () => {
      const locations = await staticData.getLocations();
      const achievements = await staticData.getAchievements();

      if (isSubscribed) {
        setLocations(locations);
        setAchievements(achievements);
      }
    })();

    return () => (isSubscribed = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  // Non-static data and Non-user related data
  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    let isSubscribed = true;

    (async () => {
      const companyAttrs = await getCompanyAttributes(apiClient);
      const filtersWithCompanyAttrs = { ...searchContext.filters };
      companyAttrs.forEach((companyAttr) => {
        filtersWithCompanyAttrs[companyAttr.id] = {
          text: companyAttr.name,
          group: "Company attributes",
          active: false,
        };
      });

      if (isSubscribed) {
        searchContext.setFilters(filtersWithCompanyAttrs);
      }
    })();

    return () => (isSubscribed = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, auth0User]);

  // For the Search tab only (non static data)
  React.useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    let isSubscribed = true;
    let source = axios.CancelToken.source();

    (async () => {
      const criteria = {};
      let headers;
      let data;

      setIsSearching(true);
      setUsers([]);

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
        setPage(searchContext.pagination.page);
      }

      const { url, options, body } = helper.getSearchUsersRequestDetails({
        keyword,
        criteria,
        page: searchContext.pagination.page,
        limit: config.ITEMS_PER_PAGE,
        orderBy,
      });

      try {
        const response = await apiClient.post(url, body, {
          ...options,
          cancelToken: source.token,
        });

        headers = response.headers;
        data = response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          // Request explicitly cancelled. Ignoring
          return;
        }
        console.log(error);
        headers = {};
        data = [];
        // TODO handle error
      }

      if (isSubscribed) {
        setIsSearching(false);

        // Set the profile background color for each user
        data.forEach((u) => {
          const nextColor = colorIterator.next();
          u.avatarColor = nextColor.value;
        });

        setUsers(data);
        setTotalResults(Number(headers["x-total"]));
        setTotalPages(Number(headers["x-total-pages"]));
      }
    })();

    return () => {
      isSubscribed = false;
      source.cancel("Cancelling in cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, keyword, orderBy, searchContext]);

  /**
   * Update's the style for the sort order element, based on the current width of the page
   */
  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  return (
    <>
      <div className={style.sideMenu}>
        <FiltersSideMenu locations={locations} achievements={achievements} />
      </div>
      {!isSearching && users.length > 0 && (
        <div className={style.rightSide}>
          <div className={style.cardsHeader}>
            <div className={style.visibleCardsInfo}>
              Showing {usersPerPage * page - (usersPerPage - 1)}-
              {usersPerPage * page > totalResults
                ? totalResults
                : usersPerPage * page}{" "}
              of {totalResults} {totalResults === 1 ? "profile" : "profiles"}
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
                    onClick={() => setOrderBy("name")}
                  >
                    Name
                  </li>
                  <li
                    className={style.dropdownItem}
                    onClick={() => setOrderBy("location")}
                  >
                    Location
                  </li>
                  <li
                    className={style.dropdownItem}
                    onClick={() => setOrderBy("isAvailable")}
                  >
                    Availability
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div>
            {users.map((user) => {
              return (
                <ProfileCard
                  key={user.id}
                  profile={user}
                  avatarColor={user.avatarColor}
                />
              );
            })}
          </div>
          <div>
            <Pagination currentPage={page} numPages={totalPages} />
          </div>
        </div>
      )}
      {isSearching && (
        <div className={style.rightSide}>
          <div className={style.cardsHeader}>
            <div className={style.visibleCardsInfo}>
              Updating profile list. This can take some time. Please wait...
            </div>
          </div>
        </div>
      )}
      {!isSearching && users.length === 0 && (
        <div className={style.rightSide}>
          <div className={style.cardsHeader}>
            <div className={style.visibleCardsInfo}>
              No user profiles found. Try applying a different filter.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

SearchGlobal.propTypes = {
  keyword: PT.string,
};
