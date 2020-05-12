/**
 * A temporary app content page.
 */

import React from 'react';
import { Link } from 'react-router-dom';

import style from './style.module.scss';

export default function Content() {
  return (
    <div className={style.page}>
      <h1>U-Bahn App Prototype</h1>
      <h3>Content</h3>
      <ul>
        <li><Link to="/header">Header</Link></li>
        <li><Link to="/profile-card">Profile Card</Link></li>
        <li><Link to="/search">Search Page Assembly</Link></li>
        <li><Link to="/upload-component">Upload Component</Link></li>
      </ul>
    </div>
  );
}
