/* These polyfills are required for IE11 support. */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';
import 'regenerator-runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.scss';

import Router from './Router';

import * as serviceWorker from './serviceWorker';

import { SearchContextProvider } from './lib/search';
import { ModalContextProvider } from './lib/modal';

ReactDOM.render(
  <React.StrictMode>
    <ModalContextProvider>
      <SearchContextProvider>
        <Router />
      </SearchContextProvider>
    </ModalContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
