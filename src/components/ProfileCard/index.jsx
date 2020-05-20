import React from 'react';
import PT from 'prop-types';

import AddGroup from './AddGroup';
import AddToGroupModal from '../AddToGroupModal';
import EditProfileModal from '../EditProfileModal';
import Pill from '../Pill';
import Switch from '../Switch';

import { ReactComponent as EditIcon } from '../../assets/images/edit-icon.svg';

import style from './style.module.scss';

export default function ProfileCard({
  api,
  stripped,
  updateUser,
  user,
}) {
  const initials = user.name.split(' ').map(word => word[0]).join('');

  const [showAddToGroup, setShowAddToGroup] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);

  if (user.attributes) {
    user.available = user.attributes.find(attr => attr.attributeName === 'isAvailable').value
    user.role = user.attributes.find(attr => attr.attributeName === 'role').value;
    user.company = user.attributes.find(attr => attr.attributeName === 'company').value
    user.location = user.attributes.find(attr => attr.attributeName === 'location').value
  }

  let switchLabel = null;
  if (user) switchLabel = user.available ? 'Available' : 'Unavailable';

  let containerStyle = style.container;
  if (stripped) containerStyle += ` ${style.stripped}`;

  return (
    <div className={containerStyle}>
      {
        showAddToGroup ? (
          <AddToGroupModal
            api={api}
            onCancel={() => setShowAddToGroup(false)}
            updateUser={updateUser}
            user={user}
          />
        ) : null
      }
      {
        showEditModal ? (
          <EditProfileModal
            api={api}
            onCancel={() => setShowEditModal(false)}
            updateUser={updateUser}
            user={user}
          />
        ) : null
      }
      <div className={style.primary}>
        <div className={style.icon}>{initials}</div>
        <div className={style.auxControls}>
          <Switch
            checked={user.available}
            label={switchLabel}
            onChange={() =>
              updateUser({
                ...user,
                attributes: user.attributes.map(el =>
                  (el.attributeName === 'isAvailable' ? {...el, value: !user.available} : el)
                ),
                available: !user.available
              })
            }
          />
          <EditIcon
            className={style.editIcon}
            onClick={() => setShowEditModal(true)}
          />
        </div>
        <div className={style.name}>
          {user.name}
          {/* <span className={style.level}>{user.level}</span> */}
        </div>
        <div className={style.handle}>@{user.handle}</div>
        <div className={style.info}>
          <div>{user.role}</div>
          <div>{user.company}</div>
        </div>
      </div>
      <div className={style.groupsContainer}>
        <div className={style.groupHeader}>
          <div className={style.groupIcon} />
          <div className={style.groupLabel}>GROUP</div>
        </div>
        <div className={style.groups}>
          {
            user.groups && user.groups.map((group, index) => (
              <Pill
                name={group}
                key={group}
                onRemove={() => {
                  const u = { ...user };
                  u.groups = [...u.groups];
                  u.groups.splice(index, 1);
                  updateUser(u);
                }}
              />
            ))
          }
          <AddGroup onClick={() => setShowAddToGroup(!showAddToGroup)} />
        </div>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  api: PT.shape().isRequired,
  stripped: PT.bool,
  updateUser: PT.func.isRequired,
  user: PT.shape().isRequired,
};
