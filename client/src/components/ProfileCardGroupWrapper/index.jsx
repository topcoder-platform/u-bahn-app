import React from "react";
import PT from "prop-types";

import ProfileCard from "../ProfileCard";
import config from "../../config";
import api from "../../services/api";

import styles from "./style.module.scss";

export default function ProfileCardGroupWrapper({ user: userFromProps }) {
  const apiClient = api();
  const [user, setUser] = React.useState({});
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [errorLoadingUser, setErrorLoadingUser] = React.useState(false);

  const isCompanyAttrFilterFirstLoad = React.useRef(true);

  React.useEffect(() => {
    (async () => {
      await loadUser();
    })();

    return () => (isCompanyAttrFilterFirstLoad.current = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromProps]);

  const loadUser = async () => {
    let response;
    setLoadingUser(true);
    setErrorLoadingUser(false);

    try {
      const url = `${config.API_URL}/users/${userFromProps.universalUID}`;
      response = await apiClient.get(url, {
        params: {
          enrich: true,
        },
      });
    } catch (error) {
      console.log(error);
      setErrorLoadingUser(true);
      setUser({});
      // TODO - Handle error
      return;
    }

    if (isCompanyAttrFilterFirstLoad.current) {
      setUser({ ...response.data, avatarColor: userFromProps.avatarColor });
      setLoadingUser(false);
    }
  };

  if (loadingUser) {
    return (
      <div className={styles.containerStyle}>
        <div className={styles.card}>
          {errorLoadingUser ? "ERROR LOADING USER" : "LOADING"}
        </div>
      </div>
    );
  } else {
    return <ProfileCard profile={user} avatarColor={user.avatarColor} />;
  }
}

ProfileCardGroupWrapper.propTypes = {
  user: PT.shape().isRequired,
};
