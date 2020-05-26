import React from "react";
import ReactDom from "react-dom";
import PT from "prop-types";

import style from "./style.module.scss";

export default function Modal({ children, className, onCancel }) {
  const [portal, setPortal] = React.useState();

  React.useEffect(() => {
    const p = document.createElement("div");
    document.body.classList.add("scrolling-disabled-by-modal");
    document.body.appendChild(p);
    setPortal(p);
    return () => {
      document.body.classList.remove("scrolling-disabled-by-modal");
      document.body.removeChild(p);
    };
  }, []);

  let containerStyle = style.container;
  if (className) containerStyle += ` ${className}`;

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
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancel();
            }}
            onClick={() => onCancel()}
            className={style.overlay}
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
  onCancel: PT.func,
};
