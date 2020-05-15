/**
 * Initial content of the Upload component.
 */

import React from 'react';
import PT from 'prop-types';

import Api from '../../../services/api';

import spreadsheetIcon from '../../../assets/images/spreadsheet-icon.svg';

import style from './style.module.scss';

/**
 * 
 * @param {function} [onError] Optional. Error callback. If provided, it will be
 *  called with errors happening during HTTP calls handled by the component.
 * @param {string} templateId XLS template ID.
 */
export default function Initial({
  api,
  onError,
  onUpload,
  templateId,
}) {
  const [dragover, setDragover] = React.useState(false);
  const fileInputRef = React.useRef();

  const downloadTemplate = async () => {
    try {
      const data = await api.getTemplate(templateId);
      window.location = data.url;
    } catch (error) {
      if (onError) onError(error.toJSON());
    }
  };

  const upload = (files) => {
    if (files && files[0]) onUpload(files[0]);
  }

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
      }}
    >
      <input
        className={style.fileInput}
        onChange={(e) => upload(e.target.files)}
        ref={fileInputRef}
        type="file"
      />
      <img src={spreadsheetIcon} alt="icon" />
      <div className={style.label1}>
        Drag profile data, or
        &zwnj;
        <span
          className={style.browse}
          onClick={() => {
            fileInputRef.current.click();
          }}
        >
          browse
        </span>
      </div>
      <div className={style.label2}>Supports XLS or CSV file</div>
      <div
        className={style.label3}
        onClick={downloadTemplate}
      >
        Download Import Template (.XLS)
      </div>
    </div>
  );
}

Initial.propTypes = {
  api: PT.instanceOf(Api).isRequired,
  onError: PT.func,
  onUpload: PT.func.isRequired,
  templateId: PT.string.isRequired,
};
