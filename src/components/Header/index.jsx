import React from 'react';
import PT from 'prop-types';

import Api from '../../services/api';

import { ReactComponent as DownArrow }
  from '../../assets/images/down-arrow.svg';
import { ReactComponent as SearchTabIcon }
  from '../../assets/images/search-tab-icon.svg';
import { ReactComponent as GroupsTabIcon }
  from '../../assets/images/groups-tab-icon.svg';
import { ReactComponent as UploadsTabIcon }
  from '../../assets/images/uploads-tab-icon.svg';
import { ReactComponent as ZoomIcon } from '../../assets/images/zoom-icon.svg';

import style from './style.module.scss';

export const TABS = {
  GROUPS: 'GROUPS',
  SEARCH: 'SEARCH',
  UPLOADS: 'UPLOADS',
};

export default function Header({
  api,
  currentTab,
  onSearch,
  onTabChange,
  organizationId,
}) {
  const [org, setOrg] = React.useState({});
  const [searchText, setSearchText] = React.useState();

  React.useEffect(() => {
    (async () => {
      setOrg(await api.getOrganization(organizationId));
    })();
  }, [api, organizationId])

  const handleSearch = (value) => {
    value = value || searchText
    onSearch && onSearch(value);
  }

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
              const value = e.target.value;
              setSearchText(value);
              if (e.key === 'Enter') {
                handleSearch(value);
              }
            }}
            placeholder="Search talent or keyword"
          />
        </div>
        <div className={style.accountMenu}>
          Ashton W
          <DownArrow className={style.downArrow} />
        </div>
      </div>
      <div className={style.bottom}>
        <h1 className={style.title}>
          Leverage from the best of<br/>the talent from our organization
        </h1>
        <div className={style.menu}>
          <SearchTabIcon
            className={`${
              style.menuIcon
            } ${
              currentTab === TABS.SEARCH ? style.current : ''
            }`}
            onClick={() => onTabChange(TABS.SEARCH)}
          />
          <GroupsTabIcon
            className={`${
              style.menuIcon
            } ${
              currentTab === TABS.GROUPS ? style.current : ''
            }`}
            onClick={() => onTabChange(TABS.GROUPS)}
          />
          <UploadsTabIcon
            className={`${
              style.menuIcon
            } ${
              currentTab === TABS.UPLOADS ? style.current : ''
            }`}
            onClick={() => onTabChange(TABS.UPLOADS)}
          />
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  api: PT.instanceOf(Api).isRequired,
  currentTab: PT.oneOf(Object.values(TABS)),
  onSearch: PT.func.isRequired,
  onTabChange: PT.func.isRequired,
  organizationId: PT.string.isRequired,
};
