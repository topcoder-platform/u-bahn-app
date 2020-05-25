import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './tag.module.css';
import iconStyles from '../../styles/icons.module.css';

export const TAG_ICONS = {
    DEFAULT: 0,
    CROSS: 1,
    PLUS: 2
}

function TagButton({ icon, onlyIcon = false }) {
    let mainClass = null;
    if (icon === TAG_ICONS.CROSS) {
        mainClass = iconStyles.cross;
    } else if (icon === TAG_ICONS.PLUS) {
        mainClass = iconStyles.plus;
    }

    return (
        <div className={onlyIcon ? styles.buttonIconOnly : styles.buttonIcon}>
            <div className={mainClass}></div>
        </div>
    )
}

TagButton.propTypes = {
    icon: PropTypes.number.isRequired,
    onlyIcon: PropTypes.bool
}

export default function Tag({
    selected = false,
    selectable = true,
    highlighted = false,
    text,
    onChange,
    icon = false,
    action
}) {
    const [isSelected, setIsSelected] = useState(selected);

    let mainStyle = styles.tag;
    if (highlighted) {
        mainStyle = styles.tagHighlighted;
    } else if (isSelected) {
        mainStyle = styles.tagSelected;
    }


    const handleClick = () => {
        const newValue = !isSelected;
        setIsSelected(newValue);

        if (onChange) {
            onChange(text, newValue);
        }
    }

    const onClickAction = selectable ? handleClick : (action && action);

    /* This triggers the child to render when props.selected is changed */
    useEffect(() => {
        setIsSelected(selected);
    }, [text, selected]);

    return (
        <button className={mainStyle} onClick={onClickAction}>
            {
                (text) ? (<div className={styles.tagContent}>
                    {text && <div>{text}</div>}
                    {icon && <TagButton icon={icon} />}
                </div>)
                    : <TagButton icon={icon} onlyIcon={true} />
            }
        </button>
    );
}


Tag.propTypes = {
    text: PropTypes.string.isRequired,
    initialState: PropTypes.number,
    onChange: PropTypes.func,
    icon: PropTypes.number,
    action: PropTypes.func
};