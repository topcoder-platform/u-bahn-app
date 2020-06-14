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
  const [keyword, setKeyword] = React.useState(null);

  React.useEffect(() => {
    // Ensure that we are in the Global Search tab
    setTab(TABS.SEARCH);
  }, [keyword]);

  let mainContent;

  if (isLoading || !isAuthenticated) {
    mainContent = null;
  }

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

  return (
    <div>
      <Header
        currentTab={tab}
        onTabChange={setTab}
        onSearch={setKeyword}
        organizationId="DummyOrg"
      />
      <div className={style.mainArea}>{mainContent}</div>
    </div>
  );
}
