class ApiSuccess {
  constructor(status, message, data) {
    this.status = status < 400 ? status : "Enter correct success status";
    this.message = message == "" ? "Successful" : message;
    this.data = data ?? null | undefined;
  }

  static create(status, message, data) {
    return new ApiSuccess(status, message, data);
  }
}

export default ApiSuccess;
