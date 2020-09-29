import React from "react";
import PT from "prop-types";
import axios from "axios";
import clsx from "clsx";
import FiltersSideMenu from "../../components/FiltersSideMenu";
import { ReactComponent as DownArrowIcon } from "../../assets/images/down-arrow.svg";
import ProfileCard from "../../components/ProfileCard";
import Pagination from "../../components/Pagination";

import * as helper from "./helper";
import { getAttributes } from "../../lib/company-attributes";
import { useSearch, FILTERS } from "../../lib/search";
import { makeColorIterator, avatarColors } from "../../lib/colors";
import config from "../../config";
import api from "../../services/api";

import style from "./style.module.scss";
import _ from "lodash";

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

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function SearchGlobal({ keyword }) {
  const apiClient = api();
  const searchContext = useSearch();
  const [isSearching, setIsSearching] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [sortByDropdownShown, setSortByDropdownShown] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [orderBy, setOrderBy] = React.useState(config.DEFAULT_SORT_ORDER);
  const [totalPages, setTotalPages] = React.useState(0);
  const dropdownRef = React.useRef(null);

  const prevOrderBy = usePrevious(orderBy);
  const prevKeyword = usePrevious(keyword);
  const [prevCriteria, setPrevCriteria] = React.useState(null);
  const cancelTokenSource = axios.CancelToken.source();
  const usersPerPage = config.ITEMS_PER_PAGE;

  React.useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    window.addEventListener("click", onWholeContentClick);
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
      window.removeEventListener("click", onWholeContentClick);
    };
  });

  // Non-static data and Non-user related data
  React.useEffect(() => {
    let isSubscribed = true;

    (async () => {
      const [companyAttrs, generalAttrs] = await getAttributes(
        apiClient,
        cancelTokenSource.token
      );
      const filtersWithCompanyAttrs = { ...searchContext.filters };
      if (companyAttrs) {
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
      }
      if (generalAttrs) {
        generalAttrs.forEach((generalAttr) => {
          if (generalAttr.name === config.STANDARD_USER_ATTRIBUTES.location) {
            filtersWithCompanyAttrs[FILTERS.LOCATIONS].id = generalAttr.id;
            searchContext.setFilter(
              FILTERS.LOCATIONS,
              filtersWithCompanyAttrs[FILTERS.LOCATIONS]
            );
          }
        });
      }
    })();

    return () => {
      isSubscribed = false;
      cancelTokenSource.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For the Search tab only (non static data)
  React.useEffect(() => {
    const criteria = {};
    if (
      searchContext.filters[FILTERS.LOCATIONS].active &&
      searchContext.selectedLocations.length > 0
    ) {
      criteria.locations = searchContext.selectedLocations.map((l) => l.name);
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
      criteria.achievements = searchContext.selectedAchievements.map(
        (a) => a.name
      );
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

    // reset first page when change orderBy or criteria
    if (
      (prevOrderBy !== "undefined" && prevOrderBy !== orderBy) ||
      _.isEqual(prevCriteria, criteria) === false
    ) {
      searchContext.pagination.page = 1;
    }

    let pageChanged = false;
    if (searchContext.pagination.page !== page) {
      setPage(searchContext.pagination.page);
      pageChanged = true;
    }

    if (
      _.isEqual(prevCriteria, criteria) &&
      prevKeyword === keyword &&
      prevOrderBy === orderBy &&
      pageChanged === false
    ) {
      return;
    } else {
      setPrevCriteria(criteria);
    }

    let isSubscribed = true;

    (async () => {
      let headers;
      let data;

      setIsSearching(true);
      setUsers([]);

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
          cancelToken: cancelTokenSource.token,
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
        setSortByDropdownShown(false);
        setTotalResults(Number(headers["x-total"]));
        setTotalPages(Number(headers["x-total-pages"]));
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, orderBy, searchContext]);

  /**
   * Update's the style for the sort order element, based on the current width of the page
   */
  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  /**
   * Sets the new page number and gets the new set of users
   * @param {Number} newPageNumber The new page number
   */
  const onChangePage = async (newPageNumber) => {
    if (window) {
      window.scrollTo({
        top: 0,
      });
    }
    searchContext.changePageNumber(newPageNumber);
  };

  const onWholeContentClick = (evt) => {
    if (dropdownRef.current && !dropdownRef.current.contains(evt.target)) {
      setSortByDropdownShown(false);
    }
  };

  return (
    <>
      <div className={style.sideMenu}>
        <FiltersSideMenu />
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
              ref={dropdownRef}
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
              <DownArrowIcon className={style.downArrow} />
              {sortByDropdownShown && (
                <ul className={style.dropdown}>
                  <li
                    className={clsx(
                      style.dropdownItem,
                      orderBy === "name" && style.selected
                    )}
                    onClick={() => setOrderBy("name")}
                  >
                    Name
                  </li>
                  <li
                    className={clsx(
                      style.dropdownItem,
                      orderBy === "location" && style.selected
                    )}
                    onClick={() => setOrderBy("location")}
                  >
                    Location
                  </li>
                  <li
                    className={clsx(
                      style.dropdownItem,
                      orderBy === "isAvailable" && style.selected
                    )}
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
            <Pagination
              currentPage={page}
              numPages={totalPages}
              onChangePage={onChangePage}
            />
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
