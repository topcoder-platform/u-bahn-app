import React from "react";

import FormData from "form-data";
import PT from "prop-types";

import Container from "./Container";
import Initial from "./Initial";
import Message from "./Message";
import Progress from "./Progress";

import config from "../../config";
import api from "../../services/api";
import { getSingleOrg } from "../../services/user-org";

const STATES = {
  INITIAL: "INITIAL",
  MESSAGE: "MESSAGE",
  RESULT: "RESULT",
  UPLOADING: "UPLOADING",
};

export default function Upload({ templateId }) {
  const apiClient = api();
  const [state, setState] = React.useState({
    type: STATES.INITIAL,
    data: null,
  });

  const showError = (error) => {
    const { message } = error.toJSON ? error.toJSON() : error;
    setState({
      type: STATES.MESSAGE,
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

    setState({
      type: STATES.UPLOADING,
      data: { progress: 0 },
    });

    try {
      await apiClient.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: ({ loaded, total }) => {
          setState({
            type: STATES.UPLOADING,
            data: {
              progress: loaded / total,
            },
          });
        },
      });

      setState({
        type: STATES.MESSAGE,
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

  let content;
  switch (state.type) {
    case STATES.MESSAGE:
      content = (
        <Message
          message={state.data.message}
          onClose={() => setState({ type: STATES.INITIAL })}
          title={state.data.title}
        />
      );
      break;
    case STATES.INITIAL:
      content = (
        <Initial
          onError={showError}
          onUpload={upload}
          templateId={templateId}
        />
      );
      break;
    case STATES.UPLOADING:
      content = <Progress progress={state.data.progress} />;
      break;
    default:
      throw Error("Invalid state");
  }
  return <Container>{content}</Container>;
}

Upload.propTypes = {
  templateId: PT.string.isRequired,
};
