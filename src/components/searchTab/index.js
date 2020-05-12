import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TabPageLayout from '../tabPageLayout';
import SearchTabFilters from './filters'
import PagedResults from '../pagedResults'

/**
 * SearchTab - search tab page
 * locations: the values for the location filter options
 * skills: the values for the skills filter options
 * achievements: the values for the achievements filter options
 * profiles: the user profiles
 */
export default function SearchTab({ locations, skills, achievements, profiles }) {
    const [data, setData] = useState(profiles);

    useEffect(() => {
        setData(profiles);
    }, [profiles])

    return (
        <TabPageLayout
            leftComponent={<SearchTabFilters locations={locations} skills={skills} achievements={achievements} />}
            rightComponent={<PagedResults data={data} pageSize={10} selected={1} />} />
    );
}

SearchTab.propTypes = {
    profiles: PropTypes.array,
    locations: PropTypes.array,
    skills: PropTypes.array,
    achievements: PropTypes.array
}