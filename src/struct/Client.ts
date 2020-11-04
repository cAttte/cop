import Discord from "discord.js"
import logger from "../logger"

export default class Client extends Discord.Client {
    logger = logger
    config: {
        muteRole?: Discord.Role
        modules: any
    }
}
