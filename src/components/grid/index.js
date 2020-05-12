import React from 'react';
import styles from './grid.module.css';

/**
 * Grid - A grid component with default configuration - creates an html grid
 * childre: children components
 */
export default function Grid({ children }) {
    return (
        <div className={styles.grid}>
            {
                children.map((child, index) => {
                    return <div key={index}>{child}</div>;
                })
            }
        </div>
    )
}