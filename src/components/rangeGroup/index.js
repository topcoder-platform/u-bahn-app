import React, { useState, useEffect } from "react";
import PT from "prop-types";
import RangeSlider from "../rangeSlider";
import RangeDisplay from "../rangeDisplay";

import { useSearch } from "../../lib/search";

export default function RangeGroup({ range, selector }) {
  const search = useSearch();
  const [limits, setLimits] = useState(range);

  const [dummyState, setDummyState] = useState(0);
  /* This triggers the child to render when props is changed */
  useEffect(() => {
    setDummyState(dummyState + 1);
  }, [range]);

  const handleChange = ({ lowLimit, highLimit }) => {
    setLimits({
      lowLimit: Math.round(lowLimit),
      highLimit: Math.round(highLimit),
      rangeMin: range.rangeMin,
      rangeMax: range.rangeMax,
    });
  };

  useEffect(() => {
    if (selector) {
      search[selector](limits);
    }
  }, [search, selector]);

  return (
    <>
      <RangeSlider
        key={dummyState}
        initialLow={limits.lowLimit}
        initialHigh={limits.highLimit}
        min={limits.rangeMin}
        max={limits.rangeMax}
        onChange={handleChange}
      />
      <RangeDisplay
        shit={dummyState}
        lowLimit={limits.lowLimit}
        highLimit={limits.highLimit}
      />
    </>
  );
}

RangeGroup.propTypes = {
  range: PT.object.isRequired,
  selector: PT.string.isRequired,
};
