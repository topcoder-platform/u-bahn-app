import React from "react";
import PT from "prop-types";

import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";
import Pill from "../Pill";
import ProfileCard from "../ProfileCard";

import style from "./style.module.scss";

import { makeColorIterator, avatarColors } from "../../lib/colors";
const colorIterator = makeColorIterator(avatarColors);
const nextColor = colorIterator.next();

const COMMON_ATTRIBUTES = ["role", "company", "location", "isAvailable"];

export default function EditProfileModal({ api, onCancel, updateUser, user }) {
  const [localUser, setLocalUser] = React.useState({ ...user });
  const [skillInputValue, setSkillInputValue] = React.useState("");
  const [achieInputValue, setAchieInputValue] = React.useState("");

  return (
    <Modal className={style.container} onCancel={onCancel}>
      <ProfileCard
        api={api}
        stripped
        updateUser={setLocalUser}
        profile={localUser}
        avatarColor={nextColor.value}
      />
      <div className={style.editor}>
        <div className={style.header}>
          <h1>Edit Profile</h1>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            className={style.saveButton}
            onClick={() => {
              updateUser(localUser);
              onCancel();
            }}
          >
            Save
          </Button>
        </div>
        <h3>General</h3>
        <div className={style.inputs}>
          <Input
            label="Full name"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                name: target.value,
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.name}
          />
          <Input
            label="Current role"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                attributes: localUser.attributes.map((el) =>
                  el.attributeName === "role"
                    ? { ...el, value: target.value }
                    : el
                ),
                title: target.value,
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.title}
          />
          <Input
            label="Company"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                attributes: localUser.attributes.map((el) =>
                  el.attributeName === "company"
                    ? { ...el, value: target.value }
                    : el
                ),
                company: target.value,
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.company}
          />
          <Input
            label="Location"
            onChange={({ target }) => {
              setLocalUser({
                ...localUser,
                attributes: localUser.attributes.map((el) =>
                  el.attributeName === "location"
                    ? { ...el, value: target.value }
                    : el
                ),
                location: target.value,
              });
              setImmediate(() => target.focus());
            }}
            value={localUser.location}
          />
        </div>
        <h3>Skills</h3>
        <div className={style.pillGroup}>
          <input
            className={style.input}
            onKeyUp={({ key }) => {
              if (key === "Enter") {
                const skill = skillInputValue.trim();
                if (skill) {
                  setLocalUser({
                    ...localUser,
                    skills: [
                      ...localUser.skills,
                      {
                        name: skill,
                      },
                    ],
                  });
                }
                setSkillInputValue("");
              }
            }}
            onChange={({ target }) => {
              let { value } = target;
              if (value.endsWith(",")) {
                const skill = value.slice(0, -1).trim();
                if (skill) {
                  setLocalUser({
                    ...localUser,
                    skills: [
                      ...localUser.skills,
                      {
                        name: skill,
                      },
                    ],
                  });
                }
                value = "";
              }
              setSkillInputValue(value);
              setImmediate(() => target.focus());
            }}
            placeholder="Enter skill to add"
            value={skillInputValue}
          />
          {localUser.skills.map((it, key) => (
            <Pill
              key={key}
              name={it.name}
              onRemove={() => {
                setLocalUser({
                  ...localUser,
                  skills: localUser.skills.filter((skill) => skill !== it),
                });
              }}
            />
          ))}
        </div>
        <h3>Achievements</h3>
        <div className={style.pillGroup}>
          <input
            className={style.input}
            placeholder="Enter achievements to add"
            onKeyUp={({ key }) => {
              if (key === "Enter") {
                const achie = achieInputValue.trim();
                if (achie) {
                  setLocalUser({
                    ...localUser,
                    achievements: [
                      ...localUser.achievements,
                      {
                        name: achie,
                      },
                    ],
                  });
                }
                setAchieInputValue("");
              }
            }}
            onChange={({ target }) => {
              let { value } = target;
              if (value.endsWith(",")) {
                const achie = value.slice(0, -1).trim();
                if (achie) {
                  setLocalUser({
                    ...localUser,
                    achievements: [
                      ...localUser.achievements,
                      {
                        name: achie,
                      },
                    ],
                  });
                }
                value = "";
              }
              setAchieInputValue(value);
              setImmediate(() => target.focus());
            }}
            value={achieInputValue}
          />
          {localUser.achievements.map((it, key) => (
            <Pill
              key={key}
              name={it.name}
              onRemove={() => {
                setLocalUser({
                  ...localUser,
                  achievements: localUser.achievements.filter((a) => a !== it),
                });
              }}
            />
          ))}
        </div>
        <h3>Custom attributes</h3>
        <div className={style.inputs}>
          {localUser.attributes
            .filter((attr) => !COMMON_ATTRIBUTES.includes(attr.attributeName))
            .map((attr, key) => (
              <Input
                key={key}
                label={attr.attributeName}
                onChange={({ target }) => {
                  setLocalUser({
                    ...localUser,
                    attributes: localUser.attributes.map((el) =>
                      el.attributeName === attr.attributeName
                        ? { ...el, value: target.value }
                        : el
                    ),
                  });
                  setImmediate(() => target.focus());
                }}
                value={localUser.attributes[key].value}
              />
            ))}
        </div>
        <Button className={style.dangerButton} onClick={onCancel}>
          Delete this user
        </Button>
      </div>
    </Modal>
  );
}

EditProfileModal.propTypes = {
  api: PT.shape().isRequired,
  onCancel: PT.func.isRequired,
  updateUser: PT.func.isRequired,
  user: PT.shape().isRequired,
};
