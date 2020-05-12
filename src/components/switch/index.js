import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './switch.module.css';

export default function Switch({ isOn = false, onChange }) {
    const [checked, setChecked] = useState(isOn);

    const handleClick = () => {
        const newValue = !checked;
        setChecked(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    useEffect(() => {
        setChecked(isOn);
    }, [isOn]);

    return (
        <label className={styles.switch}>
            <input type='checkbox' defaultChecked={checked} onClick={handleClick} />
            <i></i>
        </label>
    );
}

Switch.propTypes = {
    isOn: PropTypes.bool,
    onChange: PropTypes.func
}
