/**
 * Entire search page assembly.
 */

import React from "react";

import Header, { TABS } from "../../components/Header";
import Upload from "../../components/Upload";
import SearchGlobal from "./Global";
import SearchGroups from "./Groups";

import style from "./style.module.scss";

import config from "../../config";
import { useAuth0 } from "../../react-auth0-spa";

export default function SearchPage() {
  const { isLoading, isAuthenticated } = useAuth0();
  const [tab, setTab] = React.useState(TABS.SEARCH);
  const [search, setSearch] = React.useState(null);

  let mainContent;

  if (isLoading || !isAuthenticated) {
    mainContent = null;
  }

  switch (tab) {
    case TABS.SEARCH:
      mainContent = <SearchGlobal globalSearch={search} />;
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

  return (
    <div>
      <Header
        currentTab={tab}
        onTabChange={setTab}
        onSearch={setSearch}
        organizationId="DummyOrg"
      />
      <div className={style.mainArea}>{mainContent}</div>
    </div>
  );
}
