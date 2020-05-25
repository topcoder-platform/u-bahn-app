import React, { useState, useEffect } from "react";
import PT from "prop-types";
import styles from "./rangeSlider.module.css";

const DIRECTIONS = {
  UNKNOWN: "UNKNOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

const thumbSize = 30;
const getPercentage = (current, min, max) => {
  let result = ((current - min) / (max - min)) * 100;
  if (result < 0) {
    result = 0;
  } else if (result > 100) {
    result = 100;
  }

  return result;
};

const getValue = (percentage, min, max) =>
  ((max - min) / 100) * percentage + min;

const getLeft = (percentage) => `calc(${percentage}% - ${thumbSize / 2}px)`;

const getRight = (percentage) =>
  `calc(${percentage}% - ${thumbSize + thumbSize / 2}px)`;

export default function RangeSlider({
  initialLow,
  initialHigh,
  min = 0,
  max,
  onChange,
}) {
  const [low, setLow] = useState(initialLow);
  const [high, setHigh] = useState(initialHigh);

  /* This triggers the child to render when props is changed */
  useEffect(() => {
    setLow(initialLow);
    setHigh(initialHigh);
    const newValueLeft = getValue(0, min, max);
    const newValueRight = getValue(100, min, max);

    if (currentHighRef.current > newValueLeft) {
      handleUpdateLeft(newValueLeft, 0);
      handleUpdateRight(newValueRight, 100);
    }
  }, [initialLow, initialHigh]);

  const initialLowPercentage = getPercentage(initialLow, min, max);
  const initialHighPercentage = getPercentage(initialHigh, min, max);

  const sliderRef = React.useRef();
  const thumbLeftRef = React.useRef();
  const thumbRightRef = React.useRef();

  const currentLowRef = React.useRef();
  const currentHighRef = React.useRef();

  const lastPosition = React.useRef();
  lastPosition.current = {};

  const lastPercentageLeft = React.useRef();
  const lastPercentageRight = React.useRef();
  lastPercentageLeft.current = initialLowPercentage;
  lastPercentageRight.current = initialHighPercentage;

  const rangeProgressRef = React.useRef();

  const diffLeft = React.useRef();
  const diffRight = React.useRef();

  const getDirection = (event) => {
    let direction = DIRECTIONS.UNKNOWN;
    if ("x" in lastPosition.current) {
      if (event.clientX < lastPosition.current.x) {
        direction = DIRECTIONS.LEFT;
      } else if (event.clientX > lastPosition.current.x) {
        direction = DIRECTIONS.RIGHT;
      }
    }

    return direction;
  };

  const updateLastPosition = (event) => {
    lastPosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const updateProgress = () => {
    const width =
      thumbRightRef.current.getBoundingClientRect().right -
      thumbLeftRef.current.getBoundingClientRect().left;
    rangeProgressRef.current.style.width = `${width}px`;
    rangeProgressRef.current.style.left = thumbLeftRef.current.style.left;
  };

  const handleLimitsChanged = () => {
    if (onChange) {
      onChange({
        lowLimit: currentLowRef.current,
        highLimit: currentHighRef.current,
      });
    }
  };

  /* Left slider thumb methods */
  const handleUpdateLeft = React.useCallback((valueLeft, percentageLeft) => {
    thumbLeftRef.current.style.left = getLeft(percentageLeft);
    updateProgress();
    currentLowRef.current = valueLeft;
  }, []);

  const handleMouseMoveLeft = (event) => {
    let newXLeft =
      event.clientX -
      diffLeft.current -
      sliderRef.current.getBoundingClientRect().left;

    const endLeft =
      sliderRef.current.offsetWidth - thumbLeftRef.current.offsetWidth;
    const startLeft = 0;

    if (newXLeft < startLeft) {
      newXLeft = 0;
    }

    if (newXLeft > endLeft) {
      newXLeft = endLeft;
    }

    const rightThumbLeft = thumbRightRef.current.getBoundingClientRect().left;
    const leftThumbLeft = thumbLeftRef.current.getBoundingClientRect().left;
    const direction = getDirection(event);
    if (
      leftThumbLeft + thumbSize < rightThumbLeft ||
      (direction === DIRECTIONS.LEFT &&
        leftThumbLeft + thumbSize > lastPosition.current.x)
    ) {
      const newPercentageLeft = getPercentage(newXLeft, startLeft, endLeft);
      const newValueLeft = getValue(newPercentageLeft, min, max);

      if (currentHighRef.current > newValueLeft) {
        handleUpdateLeft(newValueLeft, newPercentageLeft);
        handleLimitsChanged();
      }
    }
    updateLastPosition(event);
  };

  const handleMouseUpLeft = () => {
    document.removeEventListener("mouseup", handleMouseUpLeft);
    document.removeEventListener("mousemove", handleMouseMoveLeft);
  };

  const handleMouseDownLeft = (event) => {
    diffLeft.current =
      event.clientX - thumbLeftRef.current.getBoundingClientRect().left;

    document.addEventListener("mousemove", handleMouseMoveLeft);
    document.addEventListener("mouseup", handleMouseUpLeft);
  };

  /* Right slider thumb methods */
  const handleUpdateRight = React.useCallback((valueRight, percentageRight) => {
    thumbRightRef.current.style.left = getRight(percentageRight);
    updateProgress();
    currentHighRef.current = valueRight;
  }, []);

  const handleMouseMoveRight = (event) => {
    let newXRight =
      event.clientX -
      diffRight.current -
      sliderRef.current.getBoundingClientRect().left;

    const endRight =
      sliderRef.current.offsetWidth - thumbRightRef.current.offsetWidth;
    const startRight = 0;

    if (newXRight < startRight) {
      newXRight = 0;
    }

    if (newXRight > endRight) {
      newXRight = sliderRef.current.offsetWidth;
    }

    const rightThumbLeft = thumbRightRef.current.getBoundingClientRect().left;
    const leftThumbLeft = thumbLeftRef.current.getBoundingClientRect().left;
    const direction = getDirection(event);

    if (
      leftThumbLeft + thumbSize < rightThumbLeft ||
      (direction === DIRECTIONS.RIGHT &&
        leftThumbLeft + thumbSize < lastPosition.current.x)
    ) {
      const newPercentageRight = getPercentage(newXRight, startRight, endRight);
      const newValueRight = getValue(newPercentageRight, min, max);

      if (newValueRight > currentLowRef.current) {
        handleUpdateRight(newValueRight, newPercentageRight);
        handleLimitsChanged();
      }
    }
    updateLastPosition(event);
  };

  const handleMouseUpRight = () => {
    document.removeEventListener("mouseup", handleMouseUpRight);
    document.removeEventListener("mousemove", handleMouseMoveRight);
  };

  const handleMouseDownRight = (event) => {
    diffRight.current =
      event.clientX - thumbRightRef.current.getBoundingClientRect().left;

    document.addEventListener("mousemove", handleMouseMoveRight);
    document.addEventListener("mouseup", handleMouseUpRight);
  };

  React.useLayoutEffect(() => {
    handleUpdateLeft(initialLow, initialLowPercentage);
  }, [initialLow, initialLowPercentage, handleUpdateLeft]);

  React.useLayoutEffect(() => {
    handleUpdateRight(initialHigh, initialHighPercentage);
  }, [initialHigh, initialHighPercentage, handleUpdateRight]);

  return (
    <div className={styles.rangeSlider} ref={sliderRef}>
      <div className={styles.rangeSliderProgress} ref={rangeProgressRef} />
      <div
        id={1}
        className={styles.rangeSliderThumb}
        ref={thumbLeftRef}
        onMouseDown={handleMouseDownLeft}
      ></div>
      <div
        id={2}
        className={styles.rangeSliderThumb}
        ref={thumbRightRef}
        onMouseDown={handleMouseDownRight}
      ></div>
    </div>
  );
}

RangeSlider.propTypes = {
  initialLow: PT.number.isRequired,
  initialHigh: PT.number.isRequired,
  min: PT.number,
  max: PT.number.isRequired,
  onChange: PT.func,
};
