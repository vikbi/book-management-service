import * as path from 'path';
import * as fs from 'fs';
import * as appRoot from 'app-root-path';
import * as dotenv from 'dotenv';
import * as winston from "winston";

dotenv.config();

// ensure log directory exists
const logDirectory = path.resolve(`${appRoot}`, process.env.LOGGING_DIR || '');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const options = {
  infoFile: {
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
    ),
    filename: path.resolve(logDirectory, process.env.INFO_LOG_PATH || ''),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  errorFile: {
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
    ),
    filename: path.resolve(logDirectory, process.env.ERROR_LOG_PATH || ''),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
};

export default options;
