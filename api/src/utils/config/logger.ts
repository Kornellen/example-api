import path from "path";
import winston from "winston";
import morgan from "morgan";
import fs from "fs";

const { combine, timestamp, printf } = winston.format;

const formatter = printf(({ level, message, timestamp }) => {
  return `[${level.toUpperCase()}] ${timestamp}: ${message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), formatter),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../../../logs/combined.log"),
      level: "info",
    }),
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../../logs/combined.log"),
      level: "warn",
    }),
    new winston.transports.Console({ level: "warn" }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../../logs/error.log"),
      level: "error",
    }),
  ],
});

export const morganLogger = morgan("combined", {
  stream: fs.createWriteStream(
    path.join(__dirname, "../../../logs/combined.log")
  ),
});
