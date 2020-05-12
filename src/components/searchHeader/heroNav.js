import React from 'react';
import IconButton, { ICONS } from '../iconButton';
import { TABS, useTabs } from '../../lib/tabs';

import styles from './heroNav.module.css';

/**
 * SearchHeaderHeroNav - hero navigation presents the title and contains tab buttons that allow
 * to navigate to pages
 */
export default function SearchHeaderHeroNav() {
  return (
    <div className={styles.heroNavContainer}>
      <div id='elipse_green' className={styles.heroNavElipseGreen}></div>
      <div id='elipse_blue' className={styles.heroNavElipseBlue}></div>
      <div className={styles.heroNav}>
        <HeroNavTitle />
        <HeroNavTabs />
      </div>
    </div>
  )
}

function HeroNavTitle() {
  return (
    <div className={styles.heroNavTitle}>
      <div className={styles.heroNavTitleLine1}>Leverage from the best of</div>
      <div className={styles.heroNavTitleLine2}>the talent from your organization</div>
    </div>
  );
}

function HeroNavTabs(props) {
  const tabs = useTabs();

  function selectTab(tab) {
    tabs.selectTab(tab);
  }

  return (
    <div className={styles.heroNavTabsContainer}>
      <div className={styles.heroNavTabs}>
        <IconButton isActive={tabs.selectedTab === TABS.SEARCH} icon={ICONS.SEARCH} action={() => selectTab(TABS.SEARCH)} />
        <IconButton isActive={tabs.selectedTab === TABS.GROUP} icon={ICONS.GROUP} action={() => selectTab(TABS.GROUP)} />
        <IconButton isActive={tabs.selectedTab === TABS.UPLOAD} icon={ICONS.UPLOAD} action={() => selectTab(TABS.UPLOAD)} />
      </div>
    </div>
  );
}
