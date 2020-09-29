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
          "N/A"
        ),
    },
  };

  return state === TABLE_STATES.LOADING_LAST_UPLOADS ? (
    <div className={style.content}>
      <h1 className={style.title}>Loading last uploads...</h1>
    </div>
  ) : (
    data.length > 0 && (
      <div className={style.content}>
        <h1 className={style.title}>Past 24 Hours Upload Status</h1>
        <table className={style.tableContent}>
          <tr>
            {_.map(_.values(columns), ({ name }) => (
              <th>{name}</th>
            ))}
          </tr>
          {_.map(data, (item) => (
            <tr>
              {_.map(_.keys(columns), (colKey) => (
                <td>
                  {columns[colKey].formatter
                    ? columns[colKey].formatter(item[colKey])
                    : item[colKey] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    )
  );
}

Table.propTypes = {
  state: PT.any,
  data: PT.array.isRequired,
};
