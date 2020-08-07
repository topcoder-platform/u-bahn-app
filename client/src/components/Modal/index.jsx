import React from "react";
import ReactDom from "react-dom";
import PT from "prop-types";

import style from "./style.module.scss";

export default function Modal({ children, className, overlayClassName = "" }) {
  const [portal, setPortal] = React.useState();
  const [isDisabledScroll, disableScroll] = React.useState(false);

  React.useEffect(() => {
    const p = document.createElement("div");
    if (document.body.classList.contains("scrolling-disabled-by-modal")) {
      disableScroll(true);
    } else {
      document.body.classList.add("scrolling-disabled-by-modal");
    }
    document.body.appendChild(p);
    setPortal(p);
    return () => {
      if (isDisabledScroll === false) {
        document.body.classList.remove("scrolling-disabled-by-modal");
      }
      document.body.removeChild(p);
    };
  }, [isDisabledScroll]);

  let containerStyle = style.container;
  if (className) containerStyle += ` ${className}`;

  let overlayStyle = style.overlay;
  if (overlayClassName) overlayStyle += ` ${overlayClassName}`;

  return portal
    ? ReactDom.createPortal(
        <>
          <div
            className={containerStyle}
            onWheel={(event) => event.stopPropagation()}
          >
            {children}
          </div>
          <button
            aria-label="Cancel"
            className={overlayStyle}
            ref={(node) => {
              if (node) {
                node.focus();
              }
            }}
            type="button"
          />
        </>,
        portal
      )
    : null;
}

Modal.propTypes = {
  children: PT.node,
  className: PT.string,
};
