import chalk from "chalk"
import Discord from "discord.js"
import Action, { ActionProperties } from "./Action"

export default class PunishmentAction extends Action implements PunishmentProperties {
    type: "mute" | "kick" | "ban"
    length?: number
    target: Discord.GuildMember

    constructor(properties: ActionProperties & PunishmentProperties) {
        super(properties)
        this.type = properties.type
        this.length = properties.length
    }

    static parsePunishment(input: string): PunishmentProperties[] {
        return
    }

    static processPunishment(
        punishments: PunishmentProperties[],
        properties: ActionProperties
    ): PunishmentAction {
        return
    }

    async execute(): Promise<Discord.Base | Error> {
        return new Error()
    }

    formatError(message: string): string {
        const targetTag = chalk.blueBright(this.target.user.tag)
        const targetID = chalk.blueBright(this.target.user.id)
        return `Could not ${this.type} ${targetTag} (${targetID}): ${message}`
    }

    formatSuccess(): string {
        const pastAction = { mute: "Muted", kick: "Kicked", ban: "Banned" }[this.type]
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

type PunishmentProperties = {
    type: "mute" | "kick" | "ban"
    length?: number
}
