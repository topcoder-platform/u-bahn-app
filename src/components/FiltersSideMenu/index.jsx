import React from 'react';
import PT from 'prop-types';

import AddFiltersModal from '../AddFiltersModal';
import Button from '../Button';

import { ReactComponent as FiltersIcon }
  from '../../assets/images/filters-icon.svg';

import style from './style.module.scss';

export default function FiltersSideMenu({
  filters,
  updateFilters,
}) {
  const [showAddFilters, setShowAddFilters] = React.useState(false);
  return (
    <div className={style.container}>
      {
        showAddFilters ? (
          <AddFiltersModal
            filters={filters}
            onCancel={() => setShowAddFilters(false)}
            updateFilters={updateFilters}
          />
        ) : null
      }
      <div className={style.header}>
        <span>
          <FiltersIcon className={style.filtersIcon} />
          4 filters applied
        </span>
        <Button>Reset</Button>
      </div>
      {
        filters.map(f => f.visible && f.Render && <f.Render key={f.name} />)
      }
      <Button
        className={style.addFilterButton}
        onClick={() => setShowAddFilters(true)}
      >
        + Add Filter
      </Button>
    </div>
  );
}

FiltersSideMenu.propTypes = {
  filters: PT.arrayOf(PT.object).isRequired,
  updateFilters: PT.func.isRequired,
};
