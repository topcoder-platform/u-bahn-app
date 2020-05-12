import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tag from '../tag';

import { useSearch } from '../../lib/search';

import styles from './tagList.module.css';

export default function TagList({ tags, selected, selector }) {
    const search = useSearch();

    const [selectedTags, setSelectedTags] = useState(selected);
    const [updated, setUpdated] = useState(0);

    const handleTagSelectionChanged = (tag, isSelected) => {
        let selection = selectedTags.filter(value => {
            return value !== tag;
        });

        if (isSelected) {
            selection.push(tag);
        }

        setSelectedTags(selection);
        setUpdated(updated + 1);
    };

    useEffect(() => {
        if (selector) {
            search[selector](selectedTags);
        }
    }, [updated]);

    /* This triggers the child to render when props.selected is changed */
    useEffect(() => {
        setSelectedTags(selected);
    }, [tags, selected]);

    return (
        <div className={styles.tagList}>
            {
                tags.map((tag, index) => {
                    return <Tag
                        key={tag.name}
                        text={tag.name}
                        selected={selectedTags.indexOf(tag.name) > -1}
                        onChange={handleTagSelectionChanged} />
                })
            }
            <Tag text='More..' highlighted={true} />
        </div>
    );
}

TagList.propTypes = {
    tags: PropTypes.array.isRequired,
    selector: PropTypes.string.isRequired
}