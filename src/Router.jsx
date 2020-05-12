/**
 * Routing of application pages.
 */

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Content from './pages/Content';
import Error404 from './pages/Error404';
import Header from './pages/Header';
import ProfileCard from './pages/ProfileCard';
import SearchPage from './pages/Search';
import UploadComponent from './pages/UploadComponent';

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Content} />
        <Route exact path="/header" component={Header} />
        <Route exact path="/profile-card" component={ProfileCard} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/upload-component" component={UploadComponent} />
        <Route component={Error404} />
      </Switch>
    </BrowserRouter>
  );
}
