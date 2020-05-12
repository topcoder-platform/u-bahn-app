import React, { useState } from 'react';

import { SearchContextProvider } from '../lib/search';
import { TabsContextProvider } from '../lib/tabs';
import { ModalContextProvider } from '../lib/modal';
import SearchHeader from '../components/searchHeader';
import SearchMain from '../components/searchMain';

import styles from './search.module.css';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = q => {
    setSearchQuery(q);
  };

  return (
    <ModalContextProvider>
      <SearchContextProvider>
        <TabsContextProvider>
          <div className={styles.searchPage}>
            <SearchHeader onSearch={handleSearch} />
            <SearchMain searchQuery={searchQuery} />
          </div>
        </TabsContextProvider>
      </SearchContextProvider>
    </ModalContextProvider>
  );
}
