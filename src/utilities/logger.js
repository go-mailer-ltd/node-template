/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
require('dotenv').config();
const { NODE_ENV } = process.env;

/** MORGAN */
let { createWriteStream } = require('fs');
let { resolve } = require('path');

let morgan = require('morgan');
let dev_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version | :status :response-time ms'
let prod_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version :referrer - :user-agent | :status :response-time ms'
let morgan_format = NODE_ENV === 'production' ? prod_format : dev_format;

let request_log_stream = createWriteStream(resolve(__dirname, `../../logs/request.log`), { flags: 'a' });
exports.morgan = morgan(morgan_format, { stream: request_log_stream });

/** WINSTON */
let {
    createLogger,
    format,
    transports,
} = require('winston');

let {
    colorize,
    combine,
    printf,
    timestamp,
} = format

let log_transports = {
    console: new transports.Console({ level: 'warn' }),
    combined_log: new transports.File({ level: 'info', filename: `logs/combined.log` }),
    error_log: new transports.File({ level: 'error', filename: `logs/error.log` }),
    exception_log: new transports.File({ filename: 'logs/exception.log' }),
};

let log_format = printf(({ level, message, timestamp }) => `[${timestamp} : ${level}] - ${message}`);

let logger = createLogger({
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