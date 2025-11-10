import { Logform, LoggerOptions, createLogger, format, transports } from 'winston'
import { type ConsoleTransportOptions, type FileTransportOptions } from 'winston/lib/winston/transports'

import 'winston-mongodb'
import { type MongoDBConnectionOptions } from 'winston-mongodb'

const { combine, timestamp, label, printf } = format

const defaultFormat: Logform.Format = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}: ${message}`
})

const myFormat: Logform.Format = combine(label({ label: 'Admin Service Log' }), timestamp(), defaultFormat)

const myFormatForConsole: Logform.Format = format.combine(
	format.colorize({
		all: true
	}),
	format.label({
		label: '[LOGGER]'
	}),
	format.timestamp({
		format: 'YY-MM-DD HH:MM:SS'
	}),
	format.printf((info) => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`)
)

const consoleTransportOptions: ConsoleTransportOptions = {
	format: myFormatForConsole
}

const errorTransportOptions: FileTransportOptions = {
	filename: './src/Infra/Server/Logger/Logs/error.log',
	level: 'error'
}

const infoTransportOptions: FileTransportOptions = {
	filename: './src/Infra/Server/Logger/Logs/info.log',
	level: 'info'
}

const warningTransportOptions: FileTransportOptions = {
	filename: './src/Infra/Server/Logger/Logs/warning.log',
	level: 'warning'
}

const mongodbConnectionOptions: MongoDBConnectionOptions = {
	db: 'mongodb://127.0.0.1:27017',
	collection: 'logs',
	dbName: process.env.DB_NAME,
	options: { useNewUrlParser: true, useUnifiedTopology: true }
}

const loggerOptions: LoggerOptions = {
	format: myFormat,
	transports: [
		new transports.Console(consoleTransportOptions),
		new transports.File(errorTransportOptions),
		new transports.File(infoTransportOptions),
		new transports.File(warningTransportOptions),
		new transports.MongoDB(mongodbConnectionOptions)
	]
}

const logger = createLogger(loggerOptions)
logger.on('logging', function (_transport, _level, _msg, _meta) {})

export default logger
