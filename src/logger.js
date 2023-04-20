const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}] ${message}`;
        })
    ),
    transports: [
        new transports.File({
            filename: "logs.csv",
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    // Kasuta semikooloneid eraldajana
                    return `${timestamp};${level};${message}`;
                })
            ),
        }),
    ],
});

module.exports = logger;
