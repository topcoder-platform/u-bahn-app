import React from "react";
import PT from "prop-types";

import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";
import Pill from "../Pill";
import ProfileCard from "../ProfileCard";
import SuggestionBox from "../SuggestionBox";

import style from "./style.module.scss";
import config from "../../config";

export default function EditProfileModal({
  onCancel,
  updateUser,
  user,
  deactivateUser,
}) {
  const [localUser, setLocalUser] = React.useState(user);
  const [isSavingChanges, setIsSavingChanges] = React.useState(false);
  const [isDeactivatingUser, setisDeactivatingUser] = React.useState(false);

  const updateUserFromChild = (userDataFromChild) => {
    // Only availability can be updated
    setLocalUser({
      ...localUser,
      isAvailable: {
        id: localUser.isAvailable.id,
        value: userDataFromChild.isAvailable.value,
      },
      groups: userDataFromChild.groups,
    });
  };

  const confirmDeactivateUser = () => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      setisDeactivatingUser(true);
      deactivateUser();
    }
  };

  /**
   * Marks the skill for deletion
   * @param {String} skillExternalId The external id of the skill to delete
   */
  const deleteSkill = (skillExternalId) => {
    const index = localUser.skills.findIndex(
      (item) => item.externalId === skillExternalId
    );

    const skills = JSON.parse(JSON.stringify(localUser.skills));

    skills[index].isDeleted = true;

    setLocalUser({ ...localUser, skills });
  };

  /**
   * Adds a new skill
   * @param {Object} skill The skill object
   */
  const addSkill = (skill) => {
    // Verify that the skill does not already exist on the user
    const exists = localUser.skills.find(
      (existingSkill) => existingSkill.externalId === skill.id
    );

    if (exists) {
      return;
    }

    const skills = JSON.parse(JSON.stringify(localUser.skills));

    skills.push({
      externalId: skill.id, // The skill id returned from EMSI becomes externalId in our db
      isNew: true,
      name: skill.name,
      skillProviderId: config.EMSI_SKILLPROVIDER_ID,
    });

    setLocalUser({ ...localUser, skills });
  };

  return (
    <Modal className={style.container} onCancel={onCancel}>
      <ProfileCard
        stripped
        profile={localUser}
        avatarColor={localUser.avatarColor}
        saveChanges={false}
        formatData={false}
        updateUser={updateUserFromChild}
      />
      <div className={style.editor}>
        <div className={style.header}>
          <h1>Edit Profile</h1>
          <Button
            onClick={onCancel}
            disabled={isSavingChanges || isDeactivatingUser}
          >
            Cancel
          </Button>
          <Button
            className={
              isSavingChanges ? style.disabledButton : style.saveButton
            }
            onClick={() => {
              setIsSavingChanges(true);
              updateUser(localUser);
            }}
            disabled={isSavingChanges || isDeactivatingUser}
          >
            {isSavingChanges ? "Saving changes, please wait..." : "Save"}
          </Button>
        </div>
        <h3>General</h3>
        <div className={style.inputs}>
          <Input
            label="First name"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                firstName: target.value,
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.firstName}
          />
          <Input
            label="Last name"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                lastName: target.value,
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.lastName}
          />
          <Input
            label="Current role"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                title: {
                  id: localUser.title.id,
                  value: target.value,
                },
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.title.value}
          />
          <Input
            label="Company"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                company: {
                  id: localUser.company.id,
                  value: target.value,
                },
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.company.value}
          />
          <Input
            label="Location"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                location: {
                  id: localUser.location.id,
                  value: target.value,
                },
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.location.value}
          />
        </div>
        <h3>Skills</h3>
        <div className={style.pillGroup}>
          <SuggestionBox
            placeholder={"Search skill to add"}
            onSelect={addSkill}
            purpose="skills"
          />
          {localUser.skills
            .filter((item) => !item.isDeleted)
            .map((item) => (
              <Pill
                key={`${item.skillProviderId}-${item.externalId}`}
                name={item.name}
                onRemove={() => {
                  deleteSkill(item.externalId);
                }}
              />
            ))}
        </div>
        <h3>Achievements</h3>
        <div className={style.pillGroup}>
          {localUser.achievements.length > 0 &&
            localUser.achievements.map((value, key) => (
              <Pill key={key} name={value} removable={false} />
            ))}
          {localUser.achievements.length === 0 && (
            <span className={style.message}>
              {"This user has no achievements"}
            </span>
          )}
        </div>
        <h3>Custom attributes</h3>
        <div className={style.companyAttributes}>
          {localUser.companyAttributes.map((attr, key) => (
            <Input
              key={key}
              label={attr.name}
              onChange={({ target }) => {
                setLocalUser({
                  ...localUser,
                  companyAttributes: localUser.companyAttributes.map((el) =>
                    el.id === attr.id ? { ...el, value: target.value } : el
                  ),
                });
                setImmediate(() => target.focus());
              }}
              value={localUser.companyAttributes[key].value}
            />
          ))}
        </div>
        <Button
          className={
            isDeactivatingUser ? style.disabledDangerButton : style.dangerButton
          }
          onClick={confirmDeactivateUser}
          disabled={isDeactivatingUser || isSavingChanges}
        >
          {isDeactivatingUser ? "Deactivating" : "Deactivate this user"}
        </Button>
      </div>
    </Modal>
  );
}

EditProfileModal.propTypes = {
  onCancel: PT.func.isRequired,
  updateUser: PT.func.isRequired,
  deactivateUser: PT.func.isRequired,
  user: PT.shape().isRequired,
};
