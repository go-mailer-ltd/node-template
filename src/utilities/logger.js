/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
const { NODE_ENV } = require('../../config')

/** MORGAN */
const { createWriteStream } = require('fs')
const { resolve } = require('path')

const morgan = require('morgan')
const dev_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version | :status :response-time ms'
const prod_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version :referrer - :user-agent | :status :response-time ms'
const morgan_format = NODE_ENV === 'production' ? prod_format : dev_format

const request_log_stream = createWriteStream(resolve(__dirname, '../../logs/request.log'), { flags: 'a' })
const morgan_logger = morgan(morgan_format, { stream: request_log_stream })

/** WINSTON */
const {
  createLogger,
  format,
  transports
} = require('winston')

const {
  colorize,
  combine,
  printf,
  timestamp
} = format

const log_transports = {
  client_log: new transports.File({ level: 'error', filename: 'logs/client.log' }),
  console: new transports.Console({ level: 'warn' }),
  combined_log: new transports.File({ level: 'info', filename: 'logs/combined.log' }),
  error_log: new transports.File({ level: 'error', filename: 'logs/error.log' }),
  exception_log: new transports.File({ filename: 'logs/exception.log' }),
  mailer_log: new transports.File({ level: 'error', filename: 'logs/mailer.log' }),
  stream_log: new transports.File({ level: 'error', filename: 'logs/stream.log' })
}

const log_format = printf(({ level, message, timestamp }) => `[${timestamp} : ${level}] - ${message}`)

const logger = createLogger({
  transports: [
    log_transports.console,
    log_transports.combined_log,
    log_transports.error_log
  ],
  exceptionHandlers: [
    log_transports.exception_log
  ],
  exitOnError: false,
  format: combine(
    colorize(),
    timestamp(),
    log_format
  )
})

const client_logger = createLogger({
  transports: [
    log_transports.console,
    log_transports.client_log
  ],
  exitOnError: false,
  format: combine(
    colorize(),
    timestamp(),
    log_format
  )
})

const mail_logger = createLogger({
  transports: [
    log_transports.console,
    log_transports.mailer_log
  ],
  exitOnError: false,
  format: combine(
    colorize(),
    timestamp(),
    log_format
  )
})

const stream_logger = createLogger({
  transports: [
    log_transports.console,
    log_transports.stream_log
  ],
  exitOnError: false,
  format: combine(
    colorize(),
    timestamp(),
    log_format
  )
})

const log = console.log
const app_logger = (service = 'System') => {
  const console = (message, method = 'unspecified_method') => {
    const formatted_message = `[${service} ${method}()]: ${message}`
    log(formatted_message)
  }

  const error = (message, method = 'unspecified_method') => {
    const formatted_message = `[${service} ${method}()]: ${message}`
    logger.error(`${formatted_message}`)
  }

  const info = (message, method = 'unspecified_method') => {
    const formatted_message = `[${service} ${method}()]: ${message}`
    logger.info(`${formatted_message} ${message}`)
  }

  return { console, error, info }
}

module.exports = { app_logger, client_logger, logger, mail_logger, morgan: morgan_logger, stream_logger }
