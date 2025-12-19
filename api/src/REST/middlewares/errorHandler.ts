import { HttpError } from "../helpers/HttpError";
import { logger } from "../../utils/config/logger";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

/**
 * Global middleware to handleErros
 *
 * @returns {any}
 */

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let responseMessage: { statusCode: number; error: string };

  if (err instanceof HttpError) {
    if (!err.message.startsWith("Error")) {
      responseMessage = {
        statusCode: err.statusCode,
        error: err.message,
      };
    }

    const formattedMessage = err.message.replace(/^Error: /, "");
    responseMessage = {
      statusCode: err.statusCode,
      error: formattedMessage,
    };
  } else if (err instanceof Error) {
    responseMessage = {
      statusCode: 500,
      error: err.message.replace(/^Error: /, ""),
    };
  } else {
    responseMessage = {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
  logger.error(responseMessage.error);
  res.status(responseMessage.statusCode).json({ error: responseMessage.error });
};
