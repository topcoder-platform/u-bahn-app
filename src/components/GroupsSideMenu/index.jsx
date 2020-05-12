import React from 'react';
import PT from 'prop-types';

import Button from '../Button';
import Group from './Group';
import Search from '../Search';

import style from './style.module.scss';

function GroupGroup({
  groups,
  onSelect,
  title,
}) {
  return (
    <>
      <h3 className={style.subTitle}>{title}</h3>
      <div className={style.groups}>
        {
          groups.map(f => (
            <Group
              current={f.current}
              count={f.count}
              name={f.name}
              onClick={() => onSelect(f.name)}
              key={f.name}
            />
          ))
        }
      </div>
    </>
  );
}

export default function GroupsSideMenu({
  groups,
  updateGroups,
}) {
  const [search, setSearch] = React.useState('');

  const groupedGroups = React.useMemo(() => {
    const res = {};
    const s = search.toLowerCase();
    groups
      .filter(f => f.name.toLowerCase().includes(s))
      .forEach(f => {
        if (!res[f.type]) res[f.type] = [];
        res[f.type].push(f);
      });
    return res;
  }, [groups, search])

  return (
    <div className={style.container}>
      <h1 className={style.title}>Groups</h1>
      <div className={style.searchRow}>
        <Search
          className={style.search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search or create group"
          value={search}
        />
        <Button className={style.createButton}>+ Create</Button>
      </div>
      {
        Object.keys(groupedGroups).map(key => (
          <GroupGroup
            groups={groupedGroups[key]}
            key={key}
            onSelect={(name) => {
              updateGroups(groups.map(g => ({
                ...g,
                current: g.name === name,
              })));
            }}
            title={key}
          />
        ))
      }
    </div>
  );
}

GroupsSideMenu.propTypes = {
  groups: PT.arrayOf(PT.object),
};
