import chalk from "chalk"
import Discord from "discord.js"
import Client from "../Client"
import Action, { ActionProperties } from "./Action"
import { PunishmentType, PunishmentProperties } from "../PunishmentProvider"

export default class PunishmentAction extends Action {
    type: PunishmentType
    detail: number
    target: Discord.GuildMember

    get length() {
        return this.detail
    }

    constructor(client: Client, properties: ActionProperties & PunishmentProperties) {
        super(client, properties)
        this.type = properties.type
        this.detail = properties.detail == null ? properties.length : properties.detail
    }

    async execute(muteRole: Discord.Role): Promise<Discord.Base | Error> {
        try {
            switch (this.type) {
                case "null":
                    return this.target
                case "mute":
                    return await this.target.roles.add(muteRole)
                case "kick":
                    return await this.target.kick(this.reason)
                case "ban":
                    return await this.target.ban({ reason: this.reason })
            }
        } catch (error) {
            return error
        }
    }

    formatError(message: string): string {
        const targetTag = chalk.blueBright(this.target.user.tag)
        const targetID = chalk.blueBright(this.target.user.id)
        return `Could not ${this.type} ${targetTag} (${targetID}): ${message}`
    }

    formatSuccess(): string {
        // prettier-ignore
        const pastAction = { null: "Did nothing to", mute: "Muted", kick: "Kicked", ban: "Banned" }[this.type]
        const targetTag = chalk.blueBright(this.target.user.tag)
        const targetID = chalk.blueBright(this.target.user.id)
        const formattedLength = this.formatLength()
        return `${pastAction} ${targetTag} (${targetID})${formattedLength}.`
    }

    formatLength(): string {
        if (this.length === Infinity)
            // prettier-ignore
            return " permanently"
        else if (this.length != null)
            return ` for ${(this.length / 1000).toLocaleString()} seconds`
        return ""
    }
}
