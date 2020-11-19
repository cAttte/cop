import Discord from "discord.js"
import PunishmentProvider from "./PunishmentProvider"
import logger from "../logger"

export default class Client extends Discord.Client {
    logger = logger
    punishment = new PunishmentProvider(this)
    config: { muteRole?: Discord.Role; modules: any }
}
