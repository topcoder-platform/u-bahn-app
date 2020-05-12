import React from 'react';
import PropTypes from 'prop-types';
import styles from './tabPageLayout.module.css';

export default function TabPageLayout({ leftComponent, rightComponent }) {
    return (
        <div className={styles.tabPage}>
            {leftComponent}
            <div className={styles.tabPageRightCol}>
                {rightComponent}
            </div>
        </div>
    );
}

TabPageLayout.propTypes = {
    leftComponent: PropTypes.node,
    rightComponent: PropTypes.node
}