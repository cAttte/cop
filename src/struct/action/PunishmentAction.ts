import Discord from "discord.js"
import Action, { ActionProperties } from "./Action"

export default class PunishmentAction extends Action implements PunishmentProperties {
    type: "mute" | "kick" | "ban"
    length?: number

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
        return
    }

    formatSuccess(): string {
        return
    }
}

type PunishmentProperties = {
    type: "mute" | "kick" | "ban"
    length?: number
}
