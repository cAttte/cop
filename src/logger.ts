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
                    const color: chalk.Chalk = colors[info.level]
                    const timestamp = chalk.gray(`[${info.timestamp}]`)
                    const level = color(info.level.toUpperCase() + ":")
                    const indent = info.level.length === 4 ? "  " : " "
                    const module = chalk.gray(info.message.match(/^(\[.+\]) /)?.[1] || "")
                    const message = info.message.replace(/^\[.+\] +/, "")
                    const space = module ? " " : ""

                    return timestamp + " " + level + indent + module + space + message
                })
            )
        })
    ]
})
