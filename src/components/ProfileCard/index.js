import React from "react";
import PT from "prop-types";
import _ from "lodash";

import Switch from "../Switch";
import Tag, { TAG_ICONS } from "../tag";

import AddToGroupModal from "../AddToGroupModal";
import EditProfileModal from "../EditProfileModal";

import styles from "./profileCard.module.css";
import iconStyles from "../../styles/icons.module.css";

import config from "../../config";

/**
 * Returns the availability of the user
 * Availability is an attribute on the user and thus
 * needs to be extracted from the user's profile
 * @param {Object} profile The user profile
 * @param {String} attributeName The attribute for which the value is requested
 */
function getAttributeDetails(profile, attributeName) {
  const detail = profile.attributes.find(
    (a) => a.attribute.name === attributeName
  );

  switch (attributeName) {
    case config.PRIMARY_ATTRIBUTES.availability:
      return {
        id: detail.attribute.id,
        value: detail.value === "true",
      };
    case config.PRIMARY_ATTRIBUTES.company:
    case config.PRIMARY_ATTRIBUTES.location:
      return {
        id: detail.attribute.id,
        value: detail.value,
      };
    default:
      throw Error(`Unknown attribute ${attributeName}`);
  }
}

/**
 * Returns the initials for the user using the user name
 * @param {String} userName The user name
 */
function getUserNameInitial(userName) {
  let initials = userName.match(/\b\w/g) || [];
  initials = ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();

  return initials;
}

/**
 * ProfileCard - a profile card component
 * profile: the user profile
 * avatarColor: the color of the avatar
 */

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);

    const { profile, avatarColor, formatData } = props;
    let user;

    if (formatData) {
      // The profile data structure received from api is converted to a format
      // that is easy to use for rendering the UI as well as updating the fields
      user = {
        id: profile.id,
        handle: profile.handle,
        firstName: profile.firstName,
        lastName: profile.lastName,
        groups: [], // TODO
        skills: [], // TODO
        achievements: [], // TODO
        roles: [], // TODO
        isAvailable: getAttributeDetails(
          profile,
          config.PRIMARY_ATTRIBUTES.availability
        ),
        company: getAttributeDetails(
          profile,
          config.PRIMARY_ATTRIBUTES.company
        ),
        location: getAttributeDetails(
          profile,
          config.PRIMARY_ATTRIBUTES.location
        ),
        customAttributes: [],
        avatarColor,
      };
    } else {
      // Data is already in the format seen above. No further processing needed
      user = profile;
    }

    this.state = {
      user,
      showManageGroupsModal: false,
      showEditUserModal: false,
    };

    this.updateUserFromChild = this.updateUserFromChild.bind(this);
  }

  /**
   * Shows / hides the manage groups modal
   */
  toggleManageGroupsModal() {
    this.setState((prevState) => ({
      showManageGroupsModal: !prevState.showManageGroupsModal,
    }));
  }

  /**
   * Shows / hides the edit user modal
   */
  toggleEditUserModal() {
    this.setState((prevState) => ({
      showEditUserModal: !prevState.showEditUserModal,
    }));
  }

  /**
   * Switch between availability and unavailability of user
   * ! Will call api after state update, to update database with new value
   */
  toggleUserAvailability() {
    this.setState(
      (prevState) => {
        const user = JSON.parse(JSON.stringify(prevState.user));

        user.isAvailable.value = !user.isAvailable.value;

        return { user };
      },
      () => this.updateUserAttribute(config.PRIMARY_ATTRIBUTES.availability)
    );
  }

  /**
   * Update the state of user from child components
   * Function called by child components to keep data in sync
   * @param {Object} newUser The user object
   */
  updateUserFromChild(newUser) {
    let updatedUser = {};
    let updatedKeys = [];
    const { user: oldUser } = JSON.parse(JSON.stringify(this.state));

    delete oldUser.id;

    const userKeys = Object.keys(oldUser);

    for (let i = 0; i < userKeys.length; i++) {
      if (newUser[userKeys[i]]) {
        if (!_.isEqual(oldUser[userKeys[i]], newUser[userKeys[i]])) {
          updatedUser[userKeys[i]] = newUser[userKeys[i]];
          updatedKeys.push(userKeys[i]);
        }
      }
    }

    this.setState(
      {
        user: Object.assign(this.state.user, updatedUser),
      },
      () => this.updateUser(updatedKeys)
    );
  }

  /**
   * Will call individual apis to update the user data in the database
   * @param {Array} changedKeys The properties on the user object that have changed
   */
  async updateUser(changedKeys) {
    const { user } = this.state;
    let updatedName = false;
    let payload;

    for (let i = 0; i < changedKeys.length; i++) {
      switch (changedKeys[i]) {
        case config.PRIMARY_ATTRIBUTES.availability:
        case config.PRIMARY_ATTRIBUTES.company:
        case config.PRIMARY_ATTRIBUTES.location:
          await this.updateUserAttribute(changedKeys[i]);

          break;
        case config.PRIMARY_ATTRIBUTES.firstName:
          // Combine updates to first and last name (since they are on the same model)
          if (!updatedName) {
            if (changedKeys.includes(config.PRIMARY_ATTRIBUTES.lastName)) {
              payload = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              };
              updatedName = true;
            } else {
              payload = {
                id: user.id,
                firstName: user.firstName,
              };
            }

            await this.props.api.updateUser(payload);
          }

          break;
        case config.PRIMARY_ATTRIBUTES.lastName:
          // Combine updates to first and last name (since they are on the same model)
          if (!updatedName) {
            if (changedKeys.includes(config.PRIMARY_ATTRIBUTES.firstName)) {
              payload = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              };
              updatedName = true;
            } else {
              payload = {
                id: user.id,
                lastName: user.lastName,
              };
            }

            await this.props.api.updateUser(payload);
          }

          break;
        default:
        // For now, until all key updates are implemented, we do nothing
        // TODO throw Error(`Unknown attribute ${changedKeys[i]}`);
      }
    }
  }

  /**
   * Updates an attribute of the user
   * ! Will call api
   * @param {String} attributeName The attribute to update
   */
  async updateUserAttribute(attributeName) {
    let payload = {};
    const { user } = this.state;

    // For the edit user modal - changes are not saved by the card, but by the modal itself
    if (!this.props.saveChanges) {
      this.props.updateUser(user);

      return;
    }

    switch (attributeName) {
      case config.PRIMARY_ATTRIBUTES.availability:
        payload.userId = user.id;
        payload.attributeId = user.isAvailable.id;
        payload.value = user.isAvailable.value ? "true" : "false";
        break;
      case config.PRIMARY_ATTRIBUTES.company:
      case config.PRIMARY_ATTRIBUTES.location:
        payload.userId = user.id;
        payload.attributeId = user[attributeName].id;
        payload.value = user[attributeName].value;
        break;
      default:
        throw Error(`Unknown attribute name ${attributeName}`);
    }

    await this.props.api.updateUserAttribute(payload);
  }

  render() {
    const { api, stripped, avatarColor } = this.props;
    const { user, showManageGroupsModal, showEditUserModal } = this.state;

    let containerStyle = styles.profileCard;

    if (stripped) {
      containerStyle += ` ${styles.stripped}`;
    }

    return (
      <div className={containerStyle}>
        {showManageGroupsModal ? (
          <AddToGroupModal
            api={api}
            onCancel={() => this.toggleManageGroupsModal()}
            // TODO updateUser={updateUser}
            user={user}
          />
        ) : null}
        {showEditUserModal ? (
          <EditProfileModal
            api={api}
            onCancel={() => this.toggleEditUserModal()}
            updateUser={this.updateUserFromChild}
            user={user}
          />
        ) : null}
        <div className={styles.profileCardHeaderContainer}>
          <div className={styles.profileCardHeader}>
            <div
              className={styles.avatar}
              style={{ backgroundColor: avatarColor }}
            >
              <div className={styles.avatarText}>
                {getUserNameInitial(`${user.firstName} ${user.lastName}`)}
              </div>
            </div>
            <div className={styles.headerControls}>
              <div className={styles.headerControlsText}>
                {user.isAvailable.value ? "Available" : "Unavailable"}
              </div>
              <Switch
                checked={user.isAvailable.value}
                onChange={() => this.toggleUserAvailability()}
              />
              <EditButton onClick={() => this.toggleEditUserModal()} />
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
              <div>{user.role}</div>
            </div>
            <div className={styles.mainCompanyRow}>
              <div>{user.company.value}</div>
            </div>
          </div>
        </div>
        <div className={styles.profileCardFooterContainer}>
          <div className={styles.profileCardFooter}>
            <div className={styles.groupHeading}>
              <div className={iconStyles.bookmark}></div>
              <div className={styles.groupTitle}>Group</div>
            </div>
            <div className={styles.groupContent}>
              {user.groups &&
                user.groups.map((group, index) => {
                  return (
                    <Tag
                      key={"profileTag" + index}
                      text={group}
                      showRemoveButton={true}
                      icon={TAG_ICONS.CROSS}
                      selectable={false}
                      // TODO action={() => removeGroupFromProfile(group)}
                    />
                  );
                })}

              <div
                className={styles.plusButton}
                // TODO onClick={() => setShowAddToGroup(!showAddToGroup)}
              >
                <div className={styles.plusButtonIcon}>
                  <div className={iconStyles.plus} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileCard.propTypes = {
  profile: PT.object,
  saveChanges: PT.bool, // Should this component save the changes (true) or propagate it to the parent (false)
  formatData: PT.bool, // Should this component format the data (true) or use it as it is because it is already formatted (false)
};

ProfileCard.defaultProps = {
  saveChanges: true,
  formatData: true,
};

function EditButton({ onClick }) {
  return (
    <div className={styles.editButton} onClick={onClick}>
      <div className={iconStyles.edit}></div>
    </div>
  );
}

export default ProfileCard;
