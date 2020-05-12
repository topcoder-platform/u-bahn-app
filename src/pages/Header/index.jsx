import React from 'react';
import { Link } from 'react-router-dom';

import Api from '../../services/api';
import Header, { TABS } from '../../components/Header';

import style from './style.module.scss';

export default function HeaderPage() {
  const api = new Api({ token: 'dummy-auth-token '});

  const [tab, setTab] = React.useState(TABS.SEARCH);

  return (
    <div>
      <div className={style.page}>
        <Link to="..">&lArr; Content</Link>
        <h1>Header Components</h1>
      </div>
      <Header
        api={api}
        currentTab={tab}
        onTabChange={setTab}
      />
    </div>
  );
}
