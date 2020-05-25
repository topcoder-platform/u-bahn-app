import React from "react";

import axios from "axios";
import FormData from "form-data";
import PT from "prop-types";

import Api from "../../services/api";
import Container from "./Container";
import Initial from "./Initial";
import Message from "./Message";
import Progress from "./Progress";

const STATES = {
  INITIAL: "INITIAL",
  MESSAGE: "MESSAGE",
  RESULT: "RESULT",
  UPLOADING: "UPLOADING",
};

export default function Upload({ api, templateId }) {
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
    const data = new FormData();
    data.append("upload", file);
    const source = axios.CancelToken.source();
    setState({
      type: STATES.UPLOADING,
      data: { abort: source.cancel, progress: 0 },
    });
    try {
      const res = await api.upload(data, {
        cancelToken: source.token,
        onUploadProgress: ({ loaded, total }) => {
          setState({
            type: STATES.UPLOADING,
            data: {
              progress: loaded / total,
              abort: source.cancel,
            },
          });
        },
      });
      setState({
        type: STATES.MESSAGE,
        data: {
          title: "Import Confirmation",
          message: JSON.stringify(res),
        },
      });
    } catch (error) {
      if (error instanceof axios.Cancel) setState({ type: STATES.INITIAL });
      else showError(error);
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
          api={api}
          onError={showError}
          onUpload={upload}
          templateId={templateId}
        />
      );
      break;
    case STATES.UPLOADING:
      content = (
        <Progress onAbort={state.data.abort} progress={state.data.progress} />
      );
      break;
    default:
      throw Error("Invalid state");
  }
  return <Container>{content}</Container>;
}

Upload.propTypes = {
  api: PT.instanceOf(Api).isRequired,
  templateId: PT.string.isRequired,
};
