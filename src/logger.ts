import chalk from "chalk"
import stripANSI from "strip-ansi"
import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

const colors = {
    info: chalk.blueBright,
    error: chalk.redBright,
    warn: chalk.yellowBright,
    debug: chalk.magentaBright
}

export default winston.createLogger({
    transports: [
        new DailyRotateFile({
            level: "debug",
            format: winston.format.combine(
                winston.format.timestamp({ format: "HH:mm:ss" }),
                winston.format.printf(info => {
                    const level = info.level.toUpperCase()
                    const message = stripANSI(info.message)
                    return `[${info.timestamp}] ${level}: ${message}`
                })
            ),
            filename: "logs/%DATE%.log",
            datePattern: "YYYY-MM-DD",
            frequency: "24h"
        }),
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(info => {
                    const color = colors[info.level]
                    const timestamp = chalk.gray(`[${info.timestamp}]`)
                    const level = color(info.level.toUpperCase() + ":")
                    return `${timestamp} ${level} ${info.message}`
                })
            )
        })
    ]
})
