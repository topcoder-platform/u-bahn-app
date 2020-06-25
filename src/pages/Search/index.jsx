/**
 * Entire search page assembly.
 */

import React from "react";

import Header, { TABS } from "../../components/Header";
import Upload from "../../components/Upload";
import SearchGlobal from "./Global";
import SearchGroups from "./Groups";
import OrgSelector from "./OrgSelector";

import style from "./style.module.scss";

import config from "../../config";
import { useAuth0 } from "../../react-auth0-spa";
import * as OrgService from "../../services/user-org";
import api from "../../services/api";

export default function SearchPage() {
  const apiClient = api();
  const { isLoading, isAuthenticated, user: auth0User } = useAuth0();
  const [tab, setTab] = React.useState(TABS.SEARCH);
  const [keyword, setKeyword] = React.useState(null);
  const [selectedOrg, setSelectedOrg] = React.useState(null);
  const [userOrgs, setUserOrgs] = React.useState([]);
  const [shouldSelectOrg, setShouldSelectOrg] = React.useState(true);
  const [loadingOrgs, setLoadingOrgs] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const organizations = await OrgService.getOrg(
        apiClient,
        auth0User.nickname
      );

      setLoadingOrgs(false);

      if (!organizations) {
        return;
      }

      if (organizations.length === 1) {
        OrgService.setSingleOrg(organizations[0]);
        setSelectedOrg(organizations[0]);
        setShouldSelectOrg(false);
      } else {
        setUserOrgs(organizations);
        setShouldSelectOrg(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Ensure that we are in the Global Search tab
    setTab(TABS.SEARCH);
  }, [keyword]);

  const onSelectOrg = (org) => {
    OrgService.setSingleOrg(org);
    setSelectedOrg(org);
    setShouldSelectOrg(false);
  };

  let mainContent;

  if (isLoading || !isAuthenticated) {
    mainContent = null;
  } else if (shouldSelectOrg) {
    mainContent = (
      <OrgSelector
        userOrgs={userOrgs}
        onSelectOrg={onSelectOrg}
        loadingOrgs={loadingOrgs}
      />
    );
  } else {
    switch (tab) {
      case TABS.SEARCH:
        mainContent = <SearchGlobal keyword={keyword} />;
        break;
      case TABS.GROUPS:
        mainContent = <SearchGroups />;
        break;
      case TABS.UPLOADS:
        mainContent = <Upload templateId={config.BULK_UPLOAD_TEMPLATE_ID} />;
        break;
      default:
        throw Error("Invalid tab");
    }
  }

  return (
    <div>
      <Header
        currentTab={tab}
        onTabChange={setTab}
        onSearch={setKeyword}
        organization={selectedOrg}
      />
      <div className={style.mainArea}>{mainContent}</div>
    </div>
  );
}
