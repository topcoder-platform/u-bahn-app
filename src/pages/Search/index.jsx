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
import Api from "../../services/api";

import style from "./style.module.scss";
import { useSearch, FILTERS } from "../../lib/search";
import { makeColorIterator, avatarColors } from "../../lib/colors";
const colorIterator = makeColorIterator(avatarColors);

const NESTEDPROPERTIES = [
  "skills",
  "roles",
  "achievements",
  "externalProfiles",
  "attributes",
  "groups",
];
// Attributes of a user that can be found under the nested property `attributes` of the user
const USERATTRIBUTES = ["isAvailable", "company", "location"];

export default function SearchPage() {
  const [api] = React.useState(() => new Api({ token: "dummy-auth-token" }));
  const [page, setPage] = React.useState(1);
  const byPage = 12;
  const [totalResults, setTotalResults] = React.useState(0);
  const [search, setSearch] = React.useState(null);
  const [tab, setTab] = React.useState(TABS.SEARCH);
  const [users, setUsers] = React.useState([]);

  const [locations, setLocations] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [achievements, setAchievements] = React.useState([]);
  const [myGroups, setMyGroups] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState([]);

  const [sortBy, setSortBy] = React.useState("Name");
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

  React.useEffect(() => {
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
          "isAvailableSelected" in searchContext.selectedAvailability &&
          "isUnavailableSelected" in searchContext.selectedAvailability
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
            criteria.isUnavailable = true;
          }
        }
      }

      let { total, data } = await api.getUsers({
        search: search,
        criteria,
        page: page,
        limit: byPage,
        sortBy,
      });

      data = data.map((p) => {
        NESTEDPROPERTIES.forEach((nestedProperty) => {
          if (!p[nestedProperty]) {
            p[nestedProperty] = [];
          }
        });

        // TODO - In the original code, p.role used to exist and read from
        // TODO - attributes. Roles is property on the user object itself and one
        // TODO - need not read from attribute. So I need to figure out how to accommodate it

        if (p.attributes) {
          for (let i = 0; i < p.attributes.length; i++) {
            const userAttribute = p.attributes[i];

            if (USERATTRIBUTES.includes(userAttribute.attribute.name)) {
              p[userAttribute.attribute.name] = userAttribute.value;
            }
          }
        }

        p.name = `${p.firstName} ${p.lastName}`;

        return p;
      });

      const locations = await api.getLocations();
      const skills = await api.getSkills();
      const achievements = await api.getAchievements();
      const myGroups = await api.getMyGroups();
      const allGroups = await api.getOtherGroups();

      setUsers(data);
      setTotalResults(Number(total));

      setLocations(locations);
      setSkills(skills);
      setAchievements(achievements);
      setMyGroups(myGroups);
      setAllGroups(allGroups);
    })();
  }, [api, search, page, byPage, sortBy, searchContext]);

  let filteredUsers = users;
  // if (tab === TABS.GROUPS) {
  //   const currentGroup = (groups.find(g => g.current) || {}).name;
  //   if (currentGroup) {
  //     filteredUsers = filteredUsers.filter(
  //       user => user.groups && user.groups.includes(currentGroup)
  //     );
  //   }
  // }

  const visibleUsers = filteredUsers;

  const handleSort = (attr) => {
    setSortBy(attr);
  };

  let mainContent;
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
              <GroupsSideMenu
                userGroups={myGroups}
                allGroups={allGroups}
                profiles={users}
              />
            )}
          </div>
          <div className={style.rightSide}>
            <div className={style.cardsHeader}>
              <div className={style.visibleCardsInfo}>
                Showing {byPage * page - (byPage - 1)}-
                {byPage * page > totalResults ? totalResults : byPage * page} of{" "}
                {totalResults} profiles
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
                {!!sortBy && <span className={style.sortMode}>{sortBy}</span>}
                <DownArrowIcon />
                {sortByDropdownShown && (
                  <ul className={style.dropdown}>
                    <li
                      className={style.dropdownItem}
                      onClick={() => {
                        handleSort("Name");
                      }}
                    >
                      Name
                    </li>
                    <li
                      className={style.dropdownItem}
                      onClick={() => {
                        handleSort("Location");
                      }}
                    >
                      Location
                    </li>
                    <li
                      className={style.dropdownItem}
                      onClick={() => {
                        handleSort("Availability");
                      }}
                    >
                      Availability
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div>
              {visibleUsers.map((user, index) => {
                const nextColor = colorIterator.next();
                return (
                  <ProfileCard
                    api={api}
                    key={"profile-" + user.id}
                    profile={user}
                    avatarColor={nextColor.value}
                    updateUser={async (updatedUser) => {
                      const u = [...users];
                      u[index] = await api.updateUser(updatedUser);
                      setUsers(u);
                    }}
                  />
                );
              })}
            </div>
            <div>
              <Pagination
                currentPage={page}
                byPage={byPage}
                numPages={totalResults}
                onPage={setPage}
              />
            </div>
          </div>
        </>
      );
      break;
    case TABS.UPLOADS:
      mainContent = <Upload api={api} templateId="DummyTemplateId" />;
      break;
    default:
      throw Error("Invalid tab");
  }

  return (
    <div>
      <Header
        api={api}
        currentTab={tab}
        onTabChange={setTab}
        onSearch={setSearch}
        organizationId="DummyOrg"
      />
      <div className={style.mainArea}>{mainContent}</div>
    </div>
  );
}
