import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

export const winston = createLogger({
  format: combine(
    timestamp(),
    printf((info) => `[${info.timestamp}] : ${info.level}: ${info.message}`)
  ),
  exitOnError: false,
  transports: [new transports.Console()]
});
