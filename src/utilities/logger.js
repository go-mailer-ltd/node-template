/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
require('dotenv').config();
const { NODE_ENV } = process.env;

/** MORGAN */
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const morgan = require('morgan');
const dev_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version | :status :response-time ms'
const prod_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version :referrer - :user-agent | :status :response-time ms'
const morgan_format = NODE_ENV === 'production' ? prod_format : dev_format;

const request_log_stream = createWriteStream(resolve(__dirname, `../../logs/request.log`), { flags: 'a' });
exports.morgan = morgan(morgan_format, { stream: request_log_stream });

/** WINSTON */
const {
    createLogger,
    format,
    transports,
} = require('winston');

const {
    colorize,
    combine,
    printf,
    timestamp,
} = format

const log_transports = {
    console: new transports.Console({ level: 'warn' }),
    combined_log: new transports.File({ level: 'info', filename: `logs/combined.log` }),
    error_log: new transports.File({ level: 'error', filename: `logs/error.log` }),
    exception_log: new transports.File({ filename: 'logs/exception.log' }),
};

const log_format = printf(({ level, message, timestamp }) => `[${timestamp} : ${level}] - ${message}`);

const logger = createLogger({
    transports: [
        log_transports.console,
        log_transports.combined_log,
        log_transports.error_log,
    ],
    exceptionHandlers: [
        log_transports.exception_log,
    ],
    exitOnError: false,
    format: combine(
        colorize(),
        timestamp(),
        log_format
    )
});

exports.logger = logger;