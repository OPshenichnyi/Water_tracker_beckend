// This function return error.code and error status

const HttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpError;
