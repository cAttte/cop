import Discord from "discord.js"
import logger from "../logger"
import PunishmentProvider from "./PunishmentProvider"

type Config = { muteRole?: Discord.Role; modules: any }

export default class Client extends Discord.Client {
    logger = logger
    punishment = new PunishmentProvider(this)
    config: Config

    constructor(options: Discord.ClientOptions & { config: Config }) {
        super(options)
        this.config = options.config
    }
}
