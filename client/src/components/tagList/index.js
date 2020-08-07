import React, { useState, useEffect } from "react";
import PT from "prop-types";
import Tag from "../tag";

import { useSearch } from "../../lib/search";

import styles from "./tagList.module.scss";

export default function TagList({ tags, selected, selector, noResultsText }) {
  const search = useSearch();

  const [selectedTags, setSelectedTags] = useState(selected);
  const [updated, setUpdated] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const handleTagSelectionChanged = (tag, isSelected) => {
    let selection = selectedTags.filter((value) => {
      return value !== tag;
    });

    if (isSelected) {
      selection.push(tag);
    }

    setSelectedTags(selection);
    setUpdated(updated + 1);
    search[selector](selection);
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  /* This triggers the child to render when props.selected is changed */
  useEffect(() => {
    setSelectedTags(selected);
  }, [tags, selected]);

  return (
    <div className={styles.tagList}>
      {showAll &&
        tags.map((tag, index) => {
          return (
            <Tag
              key={tag.name}
              text={tag.name}
              selected={selectedTags.indexOf(tag.name) > -1}
              onChange={handleTagSelectionChanged}
            />
          );
        })}
      {!showAll &&
        tags.map((tag, index) => {
          if (index < 10) {
            return (
              <Tag
                key={tag.name}
                text={tag.name}
                selected={selectedTags.indexOf(tag.name) > -1}
                onChange={handleTagSelectionChanged}
              />
            );
          }

          return null;
        })}
      {!showAll && tags.length > 10 && (
        <Tag text="More.." highlighted={true} onChange={handleShowMore} />
      )}
      {tags.length === 0 && (
        <span className={styles.message}>{noResultsText}</span>
      )}
    </div>
  );
}

TagList.propTypes = {
  tags: PT.array.isRequired,
  selector: PT.string.isRequired,
};
