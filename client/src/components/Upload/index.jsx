import React from "react";

import FormData from "form-data";
import PT from "prop-types";

import Container from "./Container";
import Table, { TABLE_STATES } from "./Table";
import Initial from "./Initial";
import Message from "./Message";
import Progress from "./Progress";

import style from "./style.module.scss";

import config from "../../config";
import api from "../../services/api";
import { getSingleOrg } from "../../services/user-org";

const UPLOAD_STATES = {
  INITIAL: "INITIAL",
  MESSAGE: "MESSAGE",
  RESULT: "RESULT",
  UPLOADING: "UPLOADING",
};

export default function Upload({ templateId }) {
  const apiClient = api();
  const [uploadState, setUploadState] = React.useState({
    type: UPLOAD_STATES.INITIAL,
    data: null,
  });
  const [tableState, setTableState] = React.useState(
    TABLE_STATES.LOADING_LAST_UPLOADS
  );
  const [lastUploads, setLastUploads] = React.useState([]);

  const showError = (error) => {
    const { message } = error.toJSON ? error.toJSON() : error;
    setUploadState({
      type: UPLOAD_STATES.MESSAGE,
      data: {
        title: "Error Occured",
        message,
      },
    });
  };

  const upload = async (file) => {
    const url = `${config.API_PREFIX}/uploads`;
    const data = new FormData();

    data.append("upload", file);
    data.append("organizationId", getSingleOrg());

    setUploadState({
      type: UPLOAD_STATES.UPLOADING,
      data: { progress: 0 },
    });

    try {
      await apiClient.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: ({ loaded, total }) => {
          setUploadState({
            type: UPLOAD_STATES.UPLOADING,
            data: {
              progress: loaded / total,
            },
          });
        },
      });

      setUploadState({
        type: UPLOAD_STATES.MESSAGE,
        data: {
          title: "Profiles uploaded successfully",
          message:
            "The uploaded profiles are now being processed. This may take some time, depending on the number of profiles. Once processed, you will be able to see the profiles in the search page.",
        },
      });
    } catch (error) {
      showError(error);
    }
  };

  React.useEffect(() => {
    async function fetchUploads() {
      const url = `${config.API_PREFIX}/uploads`;

      setTableState(TABLE_STATES.LOADING_LAST_UPLOADS);

      try {
        const { data } = await apiClient.get(url);

        setTableState(TABLE_STATES.RESULT);
        console.log("response", data);
        setLastUploads(data);
      } catch (error) {
        setTableState(TABLE_STATES.RESULT);
        setLastUploads([]);
      }
    }
    fetchUploads();
  }, [apiClient]);

  let uploadSectionContent;
  switch (uploadState.type) {
    case UPLOAD_STATES.MESSAGE:
      uploadSectionContent = (
        <Message
          message={uploadState.data.message}
          onClose={() => setUploadState({ type: UPLOAD_STATES.INITIAL })}
          title={uploadState.data.title}
        />
      );
      break;
    case UPLOAD_STATES.INITIAL:
      uploadSectionContent = (
        <Initial
          onError={showError}
          onUpload={upload}
          templateId={templateId}
        />
      );
      break;
    case UPLOAD_STATES.UPLOADING:
      uploadSectionContent = <Progress progress={uploadState.data.progress} />;
      break;
    default:
      throw Error("Invalid state");
  }
  return (
    <div className={style.content}>
      <Table state={tableState} data={lastUploads} />
      <Container>{uploadSectionContent}</Container>
    </div>
  );
}

Upload.propTypes = {
  templateId: PT.string.isRequired,
};
