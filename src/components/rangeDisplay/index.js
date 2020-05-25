import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './rangeDisplay.module.css'

export default function RangeDisplay({ shit, lowLimit, highLimit }) {
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(0);

    /* This triggers the child to render when props is changed */
    useEffect(() => {
        setLow(lowLimit);
        setHigh(highLimit);
    }, [lowLimit, highLimit, shit]);

    return (
        <div className={styles.rangeDisplay}>
            <div className={styles.rangeDisplayLimitContainer}>{low}</div>
            <div className={styles.rangeDisplayTextContainer}>to</div>
            <div className={styles.rangeDisplayLimitContainer}>{high}</div>
        </div>
    );
}

RangeDisplay.propTypes = {
    lowLimit: PropTypes.number.isRequired,
    highLimit: PropTypes.number.isRequired,
}