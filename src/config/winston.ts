import fs from "fs";

const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");

const logDir = __dirname + "/../logs";
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info: any) => {
	return `${info.timestamp} ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

export const logger = winston.createLogger({
	format: combine(
		timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		logFormat
	),
	transports: [
		new winstonDaily({
			level: "info",
			datePattern: "YYYY-MM-DD",
			dirname: logDir,
			filename: `%DATE%.log`,
			maxFiles: 30,
			zippedArchive: true,
		}),
		new winstonDaily({
			level: "error",
			datePattern: "YYYY-MM-DD",
			dirname: logDir + "/error",
			filename: `%DATE%.error.log`,
			maxFiles: 30,
			zippedArchive: true,
		}),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	);
}
