import React, { useEffect } from 'react';
import PT from 'prop-types';

import Api from '../../services/api';
import Button from '../Button';
import Group from './Group';
import Modal from '../Modal';
import { ReactComponent as ZoomIcon } from '../../assets/images/zoom-icon.svg';

import style from './style.module.scss';

export default function AddToGroupModal({
  api,
  onCancel,
  updateUser,
  user,
}) {
  const [filter, setFilter] = React.useState('');
  const [otherGroups, setOtherGroups] = React.useState([]);
  const [selected, setSelected] = React.useState(new Set(user.groups));

  const switchSelected = group => {
    const neu = new Set(selected.values());
    if (neu.has(group)) neu.delete(group);
    else neu.add(group);
    setSelected(neu);
  };

  const updateOtherGroups = React.useCallback(async () => {
    let groups = await api.getGroups(filter);
    const userGroups = new Set(user.groups);
    groups = groups.filter(g => !userGroups.has(g));
    setOtherGroups(groups.slice(0, 4));
  }, [api, filter, user]);

  useEffect(() => {
    updateOtherGroups();
  }, [updateOtherGroups]);

  return (
    <Modal onCancel={onCancel}>
      <h1 className={style.title}>Add to Group</h1>
      <div className={style.searchRow}>
        <ZoomIcon className={style.zoomIcon} />
        <input
          className={style.search}
          onChange={({ target }) => {
            setFilter(target.value)
            setImmediate(() => target.focus());
          }}
          placeholder="Search or create group"
          value={filter}
        />
        <Button
          className={style.createButton}
          onClick={async () => {
            await api.createGroup(filter);
            await updateOtherGroups();
          }}
        >
          + Create
        </Button>
      </div>
      <h3 className={style.subTitle}>My groups</h3>
      <div className={style.groups}>
        {
          user.groups.map(g => (
            <Group
              checked={selected.has(g)}
              group={g}
              key={g}
              onSwitch={() => switchSelected(g)}
            />
          ))
        }
      </div>
      <h3 className={style.subTitle}>Other Groups</h3>
      <div className={style.groups}>
        {
          otherGroups.map(g => (
            <Group
              checked={selected.has(g)}
              group={g}
              key={g}
              onSwitch={() => switchSelected(g)}
            />
          ))
        }
      </div>
      <div className={style.buttons}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          className={style.doneButton}
          onClick={async () => {
            onCancel();
            updateUser({
              ...user,
              groups: [...selected],
            });
          }}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}

AddToGroupModal.propTypes = {
  api: PT.instanceOf(Api).isRequired,
  onCancel: PT.func.isRequired,
  updateUser: PT.func.isRequired,
  user: PT.shape().isRequired,
};
