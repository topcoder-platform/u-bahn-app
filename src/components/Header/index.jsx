import React from "react";
import PT from "prop-types";

import staticData from "../../services/static-data";

import { ReactComponent as DownArrow } from "../../assets/images/down-arrow.svg";
import { ReactComponent as SearchTabIcon } from "../../assets/images/search-tab-icon.svg";
import { ReactComponent as GroupsTabIcon } from "../../assets/images/groups-tab-icon.svg";
import { ReactComponent as UploadsTabIcon } from "../../assets/images/uploads-tab-icon.svg";
import { ReactComponent as ZoomIcon } from "../../assets/images/zoom-icon.svg";

import { useAuth0 } from "../../react-auth0-spa";

import style from "./style.module.scss";

export const TABS = {
  GROUPS: "GROUPS",
  SEARCH: "SEARCH",
  UPLOADS: "UPLOADS",
};

export default function Header({
  currentTab,
  onSearch,
  onTabChange,
  organizationId,
}) {
  const [org, setOrg] = React.useState({});
  const [searchText, setSearchText] = React.useState("");
  const [showAccountDropdown, setShowAccountDropdown] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setOrg(await staticData.getOrganization(organizationId));
    })();
  }, [organizationId]);

  const handleSearch = (value) => {
    value = value || searchText;
    onSearch && onSearch(value);
  };

  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () => {
    logout({
      redirect: window.location.origin,
    });
  };

  if (!isAuthenticated) {
    loginWithRedirect({});

    return null;
  }

  const reset = () => {
    setSearchText("");
    onSearch && onSearch("");
  };

  return (
    <div className={style.container}>
      <div className={style.top}>
        <div className={style.logo}>
          <img alt="Organization Logo" src={org.logoUrl} />
        </div>
        <div className={style.search}>
          <ZoomIcon className={style.zoomIcon} onClick={() => handleSearch()} />
          <input
            className={style.searchInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.target.value);
              }
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search talent or keyword"
          />
          <span className={style.resetKeyword} onClick={() => reset()}>
            &times;
          </span>
        </div>
        <div
          className={style.accountMenu}
          onClick={() => setShowAccountDropdown(!showAccountDropdown)}
        >
          {user.nickname}
          <DownArrow className={style.downArrow} />
          {showAccountDropdown && (
            <ul className={style.dropdown}>
              <li
                className={style.dropdownItem}
                onClick={() => logoutWithRedirect()}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className={style.bottom}>
        <h1 className={style.title}>
          Leverage from the best of
          <br />
          the talent from our organization
        </h1>
        <div className={style.menu}>
          <SearchTabIcon
            className={`${style.menuIcon} ${
              currentTab === TABS.SEARCH ? style.current : ""
            }`}
            onClick={() => onTabChange(TABS.SEARCH)}
          />
          <GroupsTabIcon
            className={`${style.menuIcon} ${
              currentTab === TABS.GROUPS ? style.current : ""
            }`}
            onClick={() => onTabChange(TABS.GROUPS)}
          />
          <UploadsTabIcon
            className={`${style.menuIcon} ${
              currentTab === TABS.UPLOADS ? style.current : ""
            }`}
            onClick={() => onTabChange(TABS.UPLOADS)}
          />
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  currentTab: PT.oneOf(Object.values(TABS)),
  onSearch: PT.func.isRequired,
  onTabChange: PT.func.isRequired,
  organizationId: PT.string.isRequired,
};
