import React, { useState } from "react";
import PT from "prop-types";
import _ from "lodash";

import Switch from "../Switch";
import UserGroup from "../UserGroup";
import AddToGroupModal from "../AddToGroupModal";
import EditProfileModal from "../EditProfileModal";

import config from "../../config";
import * as groupLib from "../../lib/groups";
import api from "../../services/api";
import * as cardHelper from "./helper";
import { getSingleOrg } from "../../services/user-org";

import styles from "./profileCard.module.css";
import iconStyles from "../../styles/icons.module.css";

function ProfileCard({
  profile,
  avatarColor,
  formatData,
  saveChanges,
  updateUser,
  stripped,
}) {
  let tempUser;
  const apiClient = api();

  if (formatData) {
    // The profile data structure received from api is converted to a format
    // that is easy to use for rendering the UI as well as updating the fields
    tempUser = {
      id: profile.id,
      handle: profile.handle,
      firstName: profile.firstName,
      lastName: profile.lastName,
      groups: cardHelper.getUserGroups(profile),
      skills: cardHelper.getUserSkills(profile),
      achievements: cardHelper.getUserAchievements(profile),
      title: cardHelper.getUserPrimaryAttributeDetails(
        profile,
        config.PRIMARY_ATTRIBUTES.title
      ),
      isAvailable: cardHelper.getUserPrimaryAttributeDetails(
        profile,
        config.PRIMARY_ATTRIBUTES.availability
      ),
      company: cardHelper.getUserPrimaryAttributeDetails(
        profile,
        config.PRIMARY_ATTRIBUTES.company
      ),
      location: cardHelper.getUserPrimaryAttributeDetails(
        profile,
        config.PRIMARY_ATTRIBUTES.location
      ),
      companyAttributes: cardHelper.getUserCompanyAttributeDetails(profile),
      avatarColor,
      // Indicates if the user has been deactivated. The user is still shown in this case, but with a
      // clear indicator about its deactivated status.
      isDeactivated: cardHelper.isUserDeactivated(profile),
    };
  } else {
    // Data is already in the format seen above. No further processing needed
    tempUser = profile;
  }

  const [user, setUser] = useState(tempUser);
  const [showManageGroupsModal, setShowManageGroupsModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  /**
   * Switch between availability and unavailability of user
   * ! Will call api to update value in database
   */
  const toggleUserAvailability = async () => {
    let updatedUser = JSON.parse(JSON.stringify(user));

    updatedUser.isAvailable.value = !updatedUser.isAvailable.value;

    setUser(updatedUser);

    if (!saveChanges) {
      updateUser(updatedUser);

      return;
    }

    setUpdatingAvailability(true);
    await cardHelper.updateUserAttribute(
      apiClient,
      updatedUser,
      config.PRIMARY_ATTRIBUTES.availability
    );
    setUpdatingAvailability(false);
  };

  /**
   * Removes deleted and newly created skills and groups from the user
   * @param {Object} updatedUser The updated user object
   */
  const updateSkillsAndGroups = (updatedUser) => {
    // Remove the removed skills from the user state
    // and unmark the new skills (as no longer being new)
    updatedUser = JSON.parse(JSON.stringify(updatedUser));
    updatedUser.skills = updatedUser.skills
      .filter((item) => item.isDeleted !== true)
      .map((item) => {
        if (item.isNew) {
          delete item.isNew;
        }

        return item;
      });

    // Remove the removed groups from the user state
    // and unmark the new groups (as no longer being new)
    updatedUser.groups = updatedUser.groups
      .filter((item) => item.isDeleted !== true)
      .map((item) => {
        if (item.isNew) {
          delete item.isNew;
        }

        return item;
      });

    setUser(updatedUser);
  };

  /**
   * Called by child components for when they have updated the user object
   * and want to keep this parent in sync
   * @param {Object} newUser The updated user object
   */
  const updateUserFromChild = async (newUser) => {
    let updatedUser = {};
    let updatedKeys = [];
    let updatedCompanyAttributes = [];
    const oldUser = JSON.parse(JSON.stringify(user));

    // Prevent updates to id field
    delete oldUser.id;

    const userKeys = Object.keys(oldUser);

    for (let i = 0; i < userKeys.length; i++) {
      if (newUser[userKeys[i]]) {
        if (!_.isEqual(oldUser[userKeys[i]], newUser[userKeys[i]])) {
          updatedUser[userKeys[i]] = newUser[userKeys[i]];
          updatedKeys.push(userKeys[i]);

          if (userKeys[i] === config.PRIMARY_ATTRIBUTES.companyAttributes) {
            // We need to know which attributes changed under company attributes
            for (let j = 0; j < oldUser[userKeys[i]].length; j++) {
              const oldAttribute = oldUser[userKeys[i]][j];
              const newAttribute = newUser[userKeys[i]][j];

              if (oldAttribute.value !== newAttribute.value) {
                updatedCompanyAttributes.push(newAttribute);
              }
            }
          }
        }
      }
    }

    updatedUser = { ...user, ...updatedUser };

    if (updatedKeys.length > 0) {
      setUser(updatedUser);

      // For the edit user modal - changes are not saved by the card, but by the modal itself
      if (!saveChanges) {
        updateUser(updatedUser);

        setShowManageGroupsModal(false);

        return;
      }
      await cardHelper.updateUserInDb(
        apiClient,
        updatedUser,
        updatedKeys,
        updatedCompanyAttributes
      );

      updateSkillsAndGroups(updatedUser);
    }

    // Ensure all modals are closed
    setShowEditUserModal(false);
    setShowManageGroupsModal(false);
  };

  /**
   * Deactivates the user
   * ! Will call api to update value in database
   */
  const deactivateUser = async () => {
    const organizationId = getSingleOrg();
    const url = `${config.API_URL}/users/${user.id}/externalProfiles/${organizationId}`;

    try {
      await apiClient.patch(url, { isInactive: true });
    } catch (error) {
      console.log(error);
      // TODO - Handle error
      return;
    }

    setShowEditUserModal(false);
    setUser({ ...user, isDeactivated: true });
  };

  /**
   * Removes the user from a group
   * ! Will call api to update value in database
   * @param {Object} groupToRemove The group from which we remove the user
   */
  const removeGroup = async (groupToRemove) => {
    const updatedUser = JSON.parse(JSON.stringify(user));

    updatedUser.groups = updatedUser.groups.map((group) => {
      if (group.id === groupToRemove.id) {
        group.isDeleted = true;
      }

      return group;
    });

    // For the edit user modal - changes are not saved by the card, but by the modal itself
    if (saveChanges) {
      try {
        await groupLib.removeUserFromGroup(
          apiClient,
          updatedUser.id,
          groupToRemove
        );
      } catch (error) {
        console.log(error);
        alert("Could not remove the user from the group");
        // TODO - handle error
        return;
      }
    } else {
      updateUser(updatedUser);
    }

    setUser(updatedUser);
  };

  let containerStyle = styles.profileCard;

  if (stripped) {
    containerStyle += ` ${styles.stripped}`;
  }

  return (
    <div className={containerStyle}>
      {showManageGroupsModal ? (
        <AddToGroupModal
          onCancel={() => setShowManageGroupsModal(false)}
          updateUser={updateUserFromChild}
          user={user}
        />
      ) : null}
      {showEditUserModal ? (
        <EditProfileModal
          onCancel={() => setShowEditUserModal(false)}
          updateUser={updateUserFromChild}
          user={user}
          deactivateUser={deactivateUser}
        />
      ) : null}
      <div className={styles.profileCardHeaderContainer}>
        <div className={styles.profileCardHeader}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: avatarColor }}
          >
            <div className={styles.avatarText}>
              {cardHelper.getUserNameInitial(
                `${user.firstName} ${user.lastName}`
              )}
            </div>
          </div>
          <div className={styles.headerControls}>
            <div
              className={
                updatingAvailability
                  ? styles.headerControlsUpdateText
                  : styles.headerControlsText
              }
            >
              {user.isAvailable.value ? "Available" : "Unavailable"}
            </div>
            <Switch
              checked={user.isAvailable.value}
              onChange={() => toggleUserAvailability()}
            />
            <EditButton onClick={() => setShowEditUserModal(true)} />
          </div>
        </div>
      </div>
      <div className={styles.profileCardMainContainer}>
        <div className={styles.profileCardMain}>
          <div className={styles.mainNameRow}>
            <div
              className={styles.mainNameText}
            >{`${user.firstName} ${user.lastName}`}</div>
          </div>
          <div className={styles.mainHandleRow}>
            <div>@{user.handle}</div>
          </div>
          <div className={styles.mainTitleRow}>
            <div>{user.title.value}</div>
          </div>
          <div className={styles.mainCompanyRow}>
            <div>{user.company.value}</div>
          </div>
        </div>
      </div>
      <div className={styles.profileCardFooterContainer}>
        <div className={styles.profileCardFooter}>
          <UserGroup
            user={user}
            removeGroup={removeGroup}
            showManageGroupsModal={() => setShowManageGroupsModal(true)}
          />
        </div>
      </div>
      {user.isDeactivated && (
        <div className={styles.deactivatedCard}>
          <span>This user has been deactivated</span>
        </div>
      )}
    </div>
  );
}

ProfileCard.propTypes = {
  avatarColor: PT.string,
  updateUser: PT.func,
  stripped: PT.bool,
  profile: PT.object.isRequired,
  saveChanges: PT.bool, // Should this component save the changes (true) or propagate it to the parent (false)
  formatData: PT.bool, // Should this component format the data (true) or use it as it is because it is already formatted (false)
};

ProfileCard.defaultProps = {
  saveChanges: true,
  formatData: true,
  stripped: false,
};

function EditButton({ onClick }) {
  return (
    <div className={styles.editButton} onClick={onClick}>
      <div className={iconStyles.edit}></div>
    </div>
  );
}

export default ProfileCard;
