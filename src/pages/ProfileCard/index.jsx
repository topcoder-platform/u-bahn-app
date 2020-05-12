import React from 'react';

import { Link } from 'react-router-dom';

import Api from '../../services/api';
import ProfileCard from '../../components/ProfileCard';

import style from './style.module.scss';

export default function ProfileCardPage() {
  const [api] = React.useState(() => new Api({ token: 'dummy-auth-token' }));
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    api.getUsers().then(setUsers);
  }, [api]);
  return (
    <div>
      <div className={style.page}>
        <Link to="..">&lArr; Content</Link>
        <h1>Profile Card</h1>
        <h3>Cards filled with data</h3>
        <div>
          {
            users.map((user, index) => (
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
        </div>
      </div>
    </div>
  );
}
