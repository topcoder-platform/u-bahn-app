import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Switch from '../Switch';
import Tag, { TAG_ICONS } from '../tag';

import AddToGroupModal from '../AddToGroupModal';
import EditProfileModal from '../EditProfileModal';

import styles from './profileCard.module.css';
import iconStyles from '../../styles/icons.module.css';

/**
 * ProfileCard - a profile card component
 * profile: the user profile
 * avatarColor: the color of the avatar
 */
export default function ProfileCard({ api, stripped, profile, avatarColor, updateUser }) {
    let initials = profile.name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

    const [profileData, setProfileData] = useState(profile);
    const [showAddToGroup, setShowAddToGroup] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [available, setAvailable] = React.useState(profile.isAvailable);

    useEffect(() => {
        setProfileData(profile);
        setAvailable(profile.isAvailable);
    }, [profile]);

    const switchAvailability = profile => {
        const updated = profile;
        updated.isAvailable = !updated.isAvailable;
        setAvailable(updated.isAvailable);
        updateUser(updated)
    };

    const removeGroupFromProfile = group => {
        const updated = profile;
        updated.groups = updated.groups.filter(g => g !== group);
        updateUser(updated)
    }

    let containerStyle = styles.profileCard;
    if (stripped) containerStyle += ` ${styles.stripped}`;

    return (
        <div className={containerStyle}>
            {
                showAddToGroup ? (
                <AddToGroupModal
                    api={api}
                    onCancel={() => setShowAddToGroup(false)}
                    updateUser={updateUser}
                    user={profile}
                />
                ) : null
            }
            {
                showEditModal ? (
                <EditProfileModal
                    api={api}
                    onCancel={() => setShowEditModal(false)}
                    updateUser={updateUser}
                    user={profile}
                />
                ) : null
            }
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
                        {/*<Switch isOn={profileData.isAvailable} onChange={() => switchAvailability(profileData)} />*/}
                        <Switch checked={available} onChange={() => switchAvailability(profileData)} />
                        <EditButton onClick={() => setShowEditModal(true)} />
                    </div>
                </div>
            </div>
            <div className={styles.profileCardMainContainer}>
                <div className={styles.profileCardMain}>
                    <div className={styles.mainNameRow}>
                        <div className={styles.mainNameText}>{profileData.name}</div>
                        {!!profileData.rating && <div className={styles.mainNameBagde}>{profileData.rating}</div>}
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

                        <div className={styles.plusButton} onClick={() => setShowAddToGroup(!showAddToGroup)}>
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

function EditButton({ onClick }) {
    return (
        <div className={styles.editButton} onClick={onClick}>
            <div className={iconStyles.edit}></div>
        </div>
    );
}
