/**
 * Routing of application pages.
 */

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Error404 from './pages/Error404';
import SearchPage from './pages/Search';

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={SearchPage} />
        <Route component={Error404} />
      </Switch>
    </BrowserRouter>
  );
}
