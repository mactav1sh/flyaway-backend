class AppError extends Error {
  statusCode;
  status;
  isOperational;
  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = 'error';
    this.isOperational = true;
  }
}

export default AppError;
