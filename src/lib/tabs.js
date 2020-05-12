import React from 'react';
import { createContext, useContext, useState } from 'react';

export const TABS = {
    DEFAULT: 0,
    SEARCH: 0,
    GROUP: 1,
    UPLOAD: 2
}

const TabsContext = createContext({});

export function TabsContextProvider({ children }) {
    const tabs = useProvideTabs();
    return (
        <TabsContext.Provider value={tabs}>{children}</TabsContext.Provider>
    );
}

export const useTabs = () => {
    return useContext(TabsContext);
};

function useProvideTabs() {
    const [selectedTab, setSelectedTab] = useState(TABS.DEFAULT);

    const selectTab = tab => {
        return setSelectedTab(tab);
    };

    return {
        selectedTab,
        selectTab
    };
}
