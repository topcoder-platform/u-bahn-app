import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.css';

export const BUTTON_STYLES = {
    DEFAULT: 0,
    FILL: 1,
    CREATE: 2
}

/**
 * Button component
 * text: the text to be displayed
 * action: action on click
 * style: the style of the button - can be DEFAULT, FILL, CREATE
 */
export default function Button({ text, action, style = BUTTON_STYLES.DEFAULT }) {
    let styleClass = styles.button;

    if (style === BUTTON_STYLES.FILL) {
        styleClass = styles.buttonFill;
    } else if (style === BUTTON_STYLES.CREATE) {
        styleClass = styles.buttonCreate;
    }

    return (
        <button className={styleClass} onClick={action}>
            {text}
        </button>
    );
}


Button.propTypes = {
    text: PropTypes.string.isRequired,
    action: PropTypes.func
};