import chalk from "chalk"
import Discord from "discord.js"
import Sequelize from "sequelize"
import logger from "../logger"
import PunishmentProvider from "./PunishmentProvider"

type Config = { muteRole?: Discord.Role; modules: any }

const sequelize = new Sequelize.Sequelize({
    dialect: "sqlite",
    storage: __dirname + `/../../db/cop.sqlite`,
    logging: msg => logger.debug(`${chalk.gray("[Sequelize]")} ${msg}`)
})

export default class Client extends Discord.Client {
    db = sequelize
    logger = logger
    punishment = new PunishmentProvider(this)
    config: Config

    constructor(options: Discord.ClientOptions & { config: Config }) {
        super(options)
        this.config = options.config
    }
}
