class ApiError extends Error {
  constructor(status, message, error, options) {
    super(status, message, options);
    this.status = status >= 400 ? status : "enter Error status code";
    this.message = message;
    this.options = options;
    this.error = error;
  }
}

export default ApiError;
