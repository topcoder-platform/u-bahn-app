import React from 'react';

import { Link } from 'react-router-dom';

import Api from '../../services/api';
import Upload from '../../components/Upload';

import style from './style.module.scss';

export default function UploadComponent() {
  const [api] = React.useState(() => new Api({ token: 'dummy-auth-token' }));
  return (
    <div>
      <div className={style.page}>
        <Link to="/">&lArr; Content</Link>
        <h1>Upload Component</h1>
      </div>
      <Upload api={api} templateId="DummyTemplateId" />
    </div>
  );
}
