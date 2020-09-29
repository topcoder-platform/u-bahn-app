/**
 * Content of the Table component.
 */

import React from "react";
import PT from "prop-types";
import _ from "lodash";

import style from "./style.module.scss";

export const TABLE_STATES = {
  LOADING_LAST_UPLOADS: "LOADING_LAST_UPLOADS",
  RESULT: "RESULT",
};

export default function Table({ state, data }) {
  const columns = {
    created: {
      name: "Upload Date",
      formatter: (date) =>
        new Intl.DateTimeFormat("en", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(date)),
    },
    status: { name: "Status" },
    info: { name: "Info" },
    failedRecordsUrl: {
      name: "Assets",
      formatter: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        ) : (
          "-"
        ),
    },
  };

  return state === TABLE_STATES.LOADING_LAST_UPLOADS ? (
    <div className={style.content}>
      <h1 className={style.title}>Gathering status of older uploads...</h1>
    </div>
  ) : data.length > 0 ? (
    <div className={style.content}>
      <h1 className={style.title}>Past 24 Hours Upload Status</h1>
      <table className={style.tableContent}>
        <thead>
          <tr>
            {_.map(_.values(columns), ({ name }, i) => (
              <th key={i}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(data, (item, i) => (
            <tr key={i}>
              {_.map(_.keys(columns), (colKey, j) => (
                <td key={j}>
                  {columns[colKey].formatter
                    ? columns[colKey].formatter(item[colKey])
                    : item[colKey] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className={style.content}>
      <h1 className={style.title}>Past 24 Hours Upload Status</h1>
      <table className={style.tableContent}>
        <thead>
          <tr>
            {_.map(_.values(columns), ({ name }, i) => (
              <th key={i}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4">No records uploaded in the past 24 hours</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  state: PT.any,
  data: PT.array.isRequired,
};
