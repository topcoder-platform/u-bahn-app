/**
 * Entire search page assembly.
 */

import React from 'react';

import FiltersSideMenu from '../../components/FiltersSideMenu';
import FilterGroup from '../../components/FilterGroup';
import GroupsSideMenu from '../../components/GroupsSideMenu';
import Header, { TABS } from '../../components/Header';
import Pagination from '../../components/Pagination';
import Pill from '../../components/Pill';
import ProfileCard from '../../components/ProfileCard';
import Search from '../../components/Search';
import Upload from '../../components/Upload';

import { ReactComponent as DownArrowIcon }
  from '../../assets/images/down-arrow.svg';
import Api from '../../services/api';

import style from './style.module.scss';

export default function SearchPage() {
  const [api] = React.useState(() => new Api({ token: 'dummy-auth-token' }));
  const [page, setPage] = React.useState(1);
  const byPage = 10;
  const [totalResults, setTotalResults] = React.useState(0);
  const [search, setSearch] = React.useState(null);
  const [tab, setTab] = React.useState(TABS.SEARCH);
  const [users, setUsers] = React.useState([]);

  const [filters, setFilters] = React.useState(() => [{
    name: 'Location',
    type: 'General attributes',
    visible: true,
    Render: () => (
      <FilterGroup
        title="Location"
      >
        <Search placeholder="Search by location" />
        <div className={style.pills}>
          <Pill
            className={`${style.pill} ${style.selected}`}
            name="New York"
            removable={false}
          />
          <Pill
            className={style.pill}
            name="Lisbon"
            removable={false}
          />
          <Pill
            className={`${style.pill} ${style.more}`}
            name="More..."
            removable={false}
          />
        </div>
      </FilterGroup>
    )
  }, {
    name: 'Availability',
    type: 'General attributes',
    visible: true,
    Render: () => (
      <FilterGroup
        title="Availability"
      >
        <div className={style.availability}>
          <div className={style.available}>Available</div>
          <div className={style.unavailable}>Unavailable</div>
        </div>
      </FilterGroup>
    ),
  }, {
    name: 'Skills',
    type: 'General attributes',
    visible: true,
    Render: () => (
      <FilterGroup
        title="Skills"
      >
        <Search placeholder="Search by skill" />
        <div className={style.pills}>
          <Pill
            className={`${style.pill} ${style.selected}`}
            name=".NET"
            removable={false}
          />
          <Pill
            className={style.pill}
            name="API"
            removable={false}
          />
          <Pill
            className={`${style.pill} ${style.more}`}
            name="More..."
            removable={false}
          />
        </div>
      </FilterGroup>
    ),
  }, {
    name: 'Achievements',
    type: 'General attributes',
    visible: true,
    Render: () => (
      <FilterGroup
        title="Achievements"
      >
        <Search placeholder="Search by achievement" />
        <div className={style.pills}>
          <Pill
            className={`${style.pill} ${style.selected}`}
            name="MVP Member"
            removable={false}
          />
          <Pill
            className={style.pill}
            name="Coffee addict"
            removable={false}
          />
          <Pill
            className={`${style.pill} ${style.more}`}
            name="More..."
            removable={false}
          />
        </div>
      </FilterGroup>
    ),
  }, {
    name: 'Home office',
    type: 'Company attributes',
    visible: false,
    Render: () => (
      <FilterGroup
        title="Home office"
      >
        <Search placeholder="Search by home office" />
        <div className={style.pills}>
          <Pill
            className={`${style.pill} ${style.selected}`}
            name="Home"
            removable={false}
          />
          <Pill
            className={style.pill}
            name="Office"
            removable={false}
          />
          <Pill
            className={style.pill}
            name="Playa"
            removable={false}
          />
        </div>
      </FilterGroup>
    ),
  }, {
    name: 'Custom attrbiute',
    type: 'General attributes',
    visible: false,
    Render: () => (
      <FilterGroup
        title="Custom attribute"
      >
        <Search placeholder="Search by custom attribute" />
        <div className={style.pills}>
          <Pill
            className={`${style.pill} ${style.selected}`}
            name="Attr1"
            removable={false}
          />
          <Pill
            className={style.pill}
            name="Attr2"
            removable={false}
          />
          <Pill
            className={style.pill}
            name="Attr3"
            removable={false}
          />
        </div>
      </FilterGroup>
    ),
  }]);

  const [groups, setGroups] = React.useState(() => [{
    name: 'Group 1',
    count: 15,
    current: true,
    type: 'My groups',
  }, {
    name: 'Group 2',
    count: 45,
    type: 'My groups',
  }, {
    name: 'Group 3',
    count: 5,
    type: 'My groups',
  }, {
    name: 'C++ Developers',
    count: 89,
    type: 'Other groups',
  }, {
    name: 'Java Developers',
    count: 45,
    type: 'Other groups',
  }, {
    name: 'AWS Experts',
    count: 123,
    type: 'Other groups'
  }]);

  React.useEffect(() => {
    (async () => {
      const { total, data } = await api.getUsers({ search: search, page: page, limit: byPage })
      setUsers(data);
      setTotalResults(Number(total));
    })();
  }, [api, search, page, byPage]);

  let filteredUsers = users;
  if (tab === TABS.GROUPS) {
    const currentGroup = (groups.find(g => g.current) || {}).name;
    if (currentGroup) {
      filteredUsers = filteredUsers.filter(
        user => user.groups && user.groups.includes(currentGroup)
      );
    }
  }
  const visibleUsers = filteredUsers;

  let mainContent;
  switch (tab) {
    case TABS.SEARCH:
    case TABS.GROUPS:
      mainContent = (
        <>
          <div className={style.sideMenu}>
            {
              tab === TABS.SEARCH ? (
                <FiltersSideMenu
                  filters={filters}
                  updateFilters={setFilters}
                />
              ) : (
                <GroupsSideMenu
                  groups={groups}
                  updateGroups={setGroups}
                />
              )
            }
          </div>
          <div className={style.rightSide}>
            <div className={style.cardsHeader}>
              <div className={style.visibleCardsInfo}>
                Showing {byPage * page - (byPage - 1)}-{byPage * page > totalResults? totalResults : byPage * page} of {totalResults} profiles
              </div>
              <div className={style.sort}>
                Sort by
                <span className={style.sortMode}>Rating</span>
                <DownArrowIcon />
              </div>
            </div>
            {
              visibleUsers.map((user, index) => (
                <ProfileCard
                  api={api}
                  key={user.id}
                  updateUser={async (updatedUser) => {
                    const u = [...users];
                    u[index] = await api.updateUser(updatedUser);
                    setUsers(u);
                  }}
                  user={user}
                />
              ))
            }
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
      mainContent = (
        <Upload api={api} templateId="DummyTemplateId" />
      );
      break;
    default:
      throw Error('Invalid tab');
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
      <div className={style.mainArea}>
        {mainContent}
      </div>
    </div>
  );
}
