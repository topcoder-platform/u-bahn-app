import React from 'react';
import PT from 'prop-types';

import Button from '../Button';
import Filter from './Filter';
import Modal from '../Modal';
import { ReactComponent as ZoomIcon } from '../../assets/images/zoom-icon.svg';

import style from './style.module.scss';

function FilterGroup({
  filters,
  onChange,
  title,
}) {
  return (
    <>
      <h3 className={style.subTitle}>{title}</h3>
      <div className={style.groups}>
        {
          filters.map(f => (
            <Filter
              checked={f.visible}
              filter={f.name}
              key={f.name}
              onSwitch={() => onChange(f.name, {
                ...f,
                visible: !f.visible,
              })}
            />
          ))
        }
      </div>
    </>
  );
}

FilterGroup.propTypes = {
  filters: PT.arrayOf(PT.object).isRequired,
  onChange: PT.func.isRequired,
  title: PT.string.isRequired,
};

export default function AddFiltersModal({
  filters,
  onCancel,
  updateFilters,
}) {
  const [localFilters, setLocalFilters] = React.useState(() => [...filters]);
  const [search, setSearch] = React.useState('');

  const groupedFilters = React.useMemo(() => {
    const res = {};
    const s = search.toLowerCase();
    localFilters
      .filter(f => f.name.toLowerCase().includes(s))
      .forEach(f => {
        if (!res[f.type]) res[f.type] = [];
        res[f.type].push(f);
      });
    return res;
  }, [localFilters, search])

  return (
    <Modal onCancel={onCancel}>
      <h1 className={style.title}>Add to Group</h1>
      <div className={style.searchRow}>
        <ZoomIcon className={style.zoomIcon} />
        <input
          className={style.search}
          onChange={({ target }) => {
            setSearch(target.value)
            setImmediate(() => target.focus());
          }}
          placeholder="Search filter"
          value={search}
        />
      </div>
      {
        Object.keys(groupedFilters).map((key) => (
          <FilterGroup
            filters={groupedFilters[key]}
            key={key}
            onChange={(filterName, value) => {
              const neu = [...localFilters];
              const i = neu.findIndex(f => f.name === filterName);
              if (i >= 0) neu[i] = value;
              setLocalFilters(neu);
            }}
            title={key}
          />
        ))
      }
      <div className={style.buttons}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          className={style.doneButton}
          onClick={() => {
            onCancel();
            updateFilters(localFilters);
          }}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}

AddFiltersModal.propTypes = {
  filters: PT.arrayOf(PT.object).isRequired,
  onCancel: PT.func.isRequired,
  updateFilters: PT.func.isRequired,
};
