import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  msg = "Something went wrong, try again later";
  constructor(message: string) {
    super(message);
  }
}

export default CustomAPIError;
