import React from 'react';
import PropTypes from 'prop-types';
import styles from './wideButton.module.css';

export default function WideButton({ text, action }) {
    return (
        <button className={styles.wideButton} onClick={action}>
            {text}
        </button>
    );
}


WideButton.propTypes = {
    text: PropTypes.string.isRequired,
    action: PropTypes.func
};