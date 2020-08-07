/**
 * Initial content of the Upload component.
 */

import React from "react";
import PT from "prop-types";

import api from "../../../services/api";

import spreadsheetIcon from "../../../assets/images/spreadsheet-icon.svg";

import style from "./style.module.scss";
import Message from "../Message";
import config from "../../../config";

/**
 *
 * @param {function} [onError] Optional. Error callback. If provided, it will be
 *  called with errors happening during HTTP calls handled by the component.
 * @param {string} templateId XLS template ID.
 */
export default function Initial({ onError, onUpload, templateId }) {
  const apiClient = api();
  const [dragover, setDragover] = React.useState(false);
  const fileInputRef = React.useRef();

  const [invalidFileExtension, setInvalidFileExtension] = React.useState(false);

  const [isDisabledDownload, disableDownload] = React.useState(false);
  const downloadTemplate = async () => {
    disableDownload(true);
    const url = `${config.API_PREFIX}/templates/${templateId}`;
    try {
      const { data } = await apiClient.get(url);
      window.location = data.url;
    } catch (error) {
      if (onError) onError(error);
    }
    disableDownload(false);
  };

  const upload = (files) => {
    const allowedExtensions = ["xls", "xlsx", "csv"];
    if (files && files[0]) {
      const ext = files[0].name.split(".").pop();
      if (allowedExtensions.includes(ext.toLowerCase())) {
        onUpload(files[0]);
      } else {
        setInvalidFileExtension(true);
      }
    }
  };

  let contentStyle = style.content;
  if (dragover) contentStyle += ` ${style.dragover}`;

  return (
    <div
      className={contentStyle}
      onDragOver={(e) => {
        if (!dragover) setDragover(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDragover(false);
      }}
      onDrop={(e) => {
        setDragover(false);
        upload(e.dataTransfer.files);
        e.preventDefault();
      }}
    >
      {invalidFileExtension && (
        <div className={style.message}>
          <Message
            message={"Only XLS, XLSX and CSV files are allowed"}
            onClose={() => setInvalidFileExtension(false)}
            title={"Upload Error"}
          />
        </div>
      )}
      {!invalidFileExtension && (
        <>
          <input
            className={style.fileInput}
            onChange={(e) => upload(e.target.files)}
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx,.csv"
          />
          <img src={spreadsheetIcon} alt="icon" />
          <div className={style.label1}>
            Drag profile data, or &zwnj;
            <span
              className={style.browse}
              onClick={() => {
                fileInputRef.current.click();
              }}
            >
              browse
            </span>
          </div>
          <div className={style.label2}>Supports XLS, XLSX or CSV file</div>
          <div
            className={style.label3}
            onClick={downloadTemplate}
            disabled={isDisabledDownload}
          >
            Download Import Template (.XLSX)
          </div>
        </>
      )}
    </div>
  );
}

Initial.propTypes = {
  onError: PT.func,
  onUpload: PT.func.isRequired,
  templateId: PT.string.isRequired,
};
