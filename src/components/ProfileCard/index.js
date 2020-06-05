import React from "react";
import PT from "prop-types";

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

    const { profile } = props;

    // The profile data structure received is converted to a format
    // that is easy to use for rendering the UI
    const user = {
      id: profile.id,
      handle: profile.handle,
      firstName: profile.firstName,
      lastName: profile.lastName,
      groups: [], // TODO
      skills: [], // TODO
      achievement: [], // TODO
      role: "", // TODO
      availability: getAttributeDetails(
        profile,
        config.PRIMARY_ATTRIBUTES.availability
      ),
      company: getAttributeDetails(profile, config.PRIMARY_ATTRIBUTES.company),
      location: getAttributeDetails(
        profile,
        config.PRIMARY_ATTRIBUTES.location
      ),
      customAttributes: [],
    };

    this.state = {
      user,
      showManageGroupsModal: false,
      showEditUserModal: false,
    };
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

  toggleUserAvailability() {
    this.setState(
      (prevState) => {
        const user = JSON.parse(JSON.stringify(prevState.user));

        user.availability.value = !user.availability.value;

        return { user };
      },
      () => this.updateUserAttribute(config.PRIMARY_ATTRIBUTES.availability)
    );
  }

  async updateUserAttribute(attributeName) {
    let payload = {};
    const { user } = this.state;

    switch (attributeName) {
      case config.PRIMARY_ATTRIBUTES.availability:
        payload.userId = user.id;
        payload.attributeId = user.availability.id;
        payload.value = user.availability.value ? "true" : "false";
        break;
      default:
        throw Error(`Unknown attribute name ${attributeName}`);
    }

    await this.props.api.updateUserAttribute(payload);
  }

  render() {
    const { api, stripped, avatarColor } = this.props;
    const { user, showManageGroupsModal, showEditUserModal } = this.state;

    console.log(user.availability);

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
            // TODO updateUser={updateUser}
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
                {user.availability.value ? "Available" : "Unavailable"}
              </div>
              <Switch
                checked={user.availability.value}
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
              <div>{user.handle}</div>
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
              {user.groups.map((group, index) => {
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
};

function EditButton({ onClick }) {
  return (
    <div className={styles.editButton} onClick={onClick}>
      <div className={iconStyles.edit}></div>
    </div>
  );
}

export default ProfileCard;
