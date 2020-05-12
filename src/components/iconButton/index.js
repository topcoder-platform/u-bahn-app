import React from 'react';
import PropTypes from 'prop-types';
import iconStyles from '../../styles/icons.module.css';
import componentsStyles from './iconButton.module.css';

export const ICONS = {
    SEARCH: 'search',
    GROUP: 'group',
    UPLOAD: 'upload'
}

/**
 * IconButotn
 * isActive: a flag indicating whether the button is in active state
 * icon: the icon of the button
 * action: function to be called when the button is clicked
 */
export default function IconButton({ isActive, icon, action }) {
    let buttonClass = isActive ? componentsStyles.iconButtonActive : componentsStyles.iconButton;
    let iconClass = isActive ? iconStyles.iconSearchActive : iconStyles.iconSearch;

    if (icon === ICONS.GROUP) {
        iconClass = isActive ? iconStyles.iconGroupActive : iconStyles.iconGroup;
    } else if (icon === ICONS.UPLOAD) {
        iconClass = isActive ? iconStyles.iconUploadActive : iconStyles.iconUpload;
    }

    const iconClassCurrent = iconClass;
    return (
        <div className={buttonClass} onClick={action}>
            <div className={componentsStyles.iconButtonIconContainer}>
                <div className={iconClassCurrent}></div>
            </div>
        </div>
    )
}

IconButton.propTypes = {
    action: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    icon: PropTypes.string.isRequired,
};