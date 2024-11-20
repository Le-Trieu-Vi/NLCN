class ApiError extends Error {
    constructor(status, message) {
      super();
      this.status = status;
      this.message = message;
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err);
    res.status(status).json({ status, message });
  };
  
export { errorHandler, ApiError };
  