import React from "react";
import PT from "prop-types";

import { useSearch } from "../../lib/search";
import { getNickname } from "../../lib/common";
import { ReactComponent as SearchTabIcon } from "../../assets/images/search-tab-icon.svg";
import { ReactComponent as GroupsTabIcon } from "../../assets/images/groups-tab-icon.svg";
import { ReactComponent as UploadsTabIcon } from "../../assets/images/uploads-tab-icon.svg";
import { ReactComponent as ZoomIcon } from "../../assets/images/zoom-icon.svg";

import config from "../../config";
import { clearOrg } from "../../services/user-org";

import style from "./style.module.scss";
import logo from "../../assets/images/u-bahn-logo.svg";
import iconStyles from "../../styles/icons.module.css";

export const TABS = {
  GROUPS: "GROUPS",
  SEARCH: "SEARCH",
  UPLOADS: "UPLOADS",
};

export default function Header({
  currentTab,
  onSearch,
  onTabChange,
  organization,
}) {
  const searchContext = useSearch();
  const [searchText, setSearchText] = React.useState("");
  const [showAccountDropdown, setShowAccountDropdown] = React.useState(false);
  const [nickname, setNickname] = React.useState("");

  const profileDropdownEl = React.useRef(null);
  React.useEffect(() => {
    (async () => {
      const n = await getNickname();

      setNickname(n);
    })();
  });

  React.useEffect(() => {
    if (showAccountDropdown) {
      profileDropdownEl.current.focus();
    }
  }, [showAccountDropdown]);

  const handleSearch = (value) => {
    value = value || searchText;

    if (!value || value.trim().length === 0) {
      alert("Enter talent or keyword to search");
      return;
    }
    searchContext.changePageNumber(1);
    onSearch && onSearch(value.trim());
  };

  const logoutWithRedirect = () => {
    clearOrg();
    const url = `${
      config.AUTH.TC_AUTH_URL
    }?logout=true&retUrl=${encodeURIComponent(config.AUTH.APP_URL)}`;
    window.location.href = url;
  };

  const reset = () => {
    setSearchText("");
    onSearch && onSearch("");
  };

  return (
    <div className={style.container}>
      <div className={style.top}>
        <div className={style.logo}>
          <img alt="Organization Logo" src={logo} />
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
          <span
            className={
              searchText.length > 0
                ? `${style.resetKeyword}`
                : `${style.resetKeyword} ${style.resetKeywordHidden}`
            }
            onClick={() => reset()}
          >
            &times;
          </span>
        </div>
        <div
          className={style.accountMenu}
          onMouseDown={() => setShowAccountDropdown(!showAccountDropdown)}
        >
          {nickname}
          {organization ? <>&nbsp;({organization.name})</> : ""}
          {showAccountDropdown ? (
            <div className={`${iconStyles.chevronUpG} ${style.arrow}`}></div>
          ) : (
            <div className={`${iconStyles.chevronDownG} ${style.arrow}`}></div>
          )}
          {showAccountDropdown && (
            <ul
              tabIndex="0"
              className={style.dropdown}
              ref={profileDropdownEl}
              onBlur={() => setShowAccountDropdown(false)}
            >
              <li
                className={style.dropdownItem}
                onMouseDown={() => logoutWithRedirect()}
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
            title="Search Profiles"
          />
          <GroupsTabIcon
            className={`${style.menuIcon} ${
              currentTab === TABS.GROUPS ? style.current : ""
            }`}
            onClick={() => onTabChange(TABS.GROUPS)}
            title="Groups"
          />
          <UploadsTabIcon
            className={`${style.menuIcon} ${
              currentTab === TABS.UPLOADS ? style.current : ""
            }`}
            onClick={() => onTabChange(TABS.UPLOADS)}
            title="Data Import"
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
  organization: PT.shape(),
};
