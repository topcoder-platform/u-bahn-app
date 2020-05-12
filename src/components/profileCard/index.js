import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Switch from '../switch';
import Tag, { TAG_ICONS } from '../tag';

import styles from './profileCard.module.css';
import iconStyles from '../../styles/icons.module.css';
import backend from '../../lib/backend';

/**
 * ProfileCard - a profile card component
 * profile: the user profile
 * avatarColor: the color of the avatar
 */
export default function ProfileCard({ profile, avatarColor }) {
    let initials = profile.name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

    const [profileData, setPofileData] = useState(profile);

    const switchAvailability = profile => {
        const updated = profile;
        updated.isAvailable = !updated.isAvailable;
        const updatedProfile = backend.updateProfile(updated);
        setPofileData({ ...updatedProfile });
    };

    const removeGroupFromProfile = group => {
        const updated = profile;
        updated.groups = updated.groups.filter(g => g !== group);
        const updatedProfile = backend.updateProfile(updated);
        setPofileData({ ...updatedProfile });
    }

    return (
        <div className={styles.profileCard}>
            <div className={styles.profileCardHeaderContainer}>
                <div className={styles.profileCardHeader}>
                    <div className={styles.avatar} style={{ backgroundColor: avatarColor }}>
                        <div className={styles.avatarText}>
                            {initials}
                        </div>
                    </div>
                    <div className={styles.headerControls}>
                        <div className={styles.headerControlsText}>
                            {profileData.isAvailable ? 'Available' : 'Unavailable'}
                        </div>
                        <Switch isOn={profileData.isAvailable} onChange={() => switchAvailability(profileData)} />
                        <EditButton />
                    </div>
                </div>
            </div>
            <div className={styles.profileCardMainContainer}>
                <div className={styles.profileCardMain}>
                    <div className={styles.mainNameRow}>
                        <div className={styles.mainNameText}>{profileData.name}</div>
                        <div className={styles.mainNameBagde}>{profileData.rating}</div>
                    </div>
                    <div className={styles.mainHandleRow}>
                        <div>{profileData.handle}</div>
                    </div>
                    <div className={styles.mainTitleRow}>
                        <div>{profileData.title}</div>
                    </div>
                    <div className={styles.mainCompanyRow}>
                        <div>{profileData.company}</div>
                    </div>
                </div>
            </div>
            <div className={styles.profileCardFooterContainer}>
                <div className={styles.profileCardFooter}>
                    <div className={styles.groupHeading}>
                        <div className={iconStyles.bookmark}></div>
                        <div className={styles.groupTitle}>
                            Group
                        </div>
                    </div>
                    <div className={styles.groupContent}>
                        {
                            profileData.groups.map((group, index) => {
                                return <Tag
                                    key={'profileTag' + index}
                                    text={group}
                                    showRemoveButton={true}
                                    icon={TAG_ICONS.CROSS}
                                    selectable={false}
                                    action={() => removeGroupFromProfile(group)} />
                            })
                        }

                        <div className={styles.plusButton}>
                            <div className={styles.plusButtonIcon} >
                                <div className={iconStyles.plus} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

ProfileCard.propTypes = {
    profile: PropTypes.object
}

function EditButton() {
    return (
        <div className={styles.editButton}>
            <div className={iconStyles.edit}></div>
        </div>
    );
}