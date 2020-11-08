import chalk from "chalk"
import Discord from "discord.js"
import parseDuration from "parse-duration"
import Action, { ActionProperties } from "./Action"

export default class PunishmentAction extends Action implements PunishmentProperties {
    type: "null" | "mute" | "kick" | "ban"
    length?: number
    target: Discord.GuildMember

    constructor(properties: ActionProperties & PunishmentProperties) {
        super(properties)
        this.type = properties.type
        this.length = properties.length
    }

    static parsePunishment(input: string | string[]): PunishmentProperties[] | Error {
        if (typeof input === "string")
            input = input.split(/ +?(,|;|then|(,|;) +?then) +?/i)

        const parsed: PunishmentProperties[] = []
        for (const punishment of input) {
            if (punishment.match(/null|none|nothing/i)) {
                parsed.push({ type: "null" })
                continue
            }

            const properties: PunishmentProperties = { type: null }
            const typeMatch = punishment.match(/^(mute|kick|ban) +?/i)
            const type = (typeMatch[1] || "").toLowerCase()
            if (!["mute", "kick", "ban"].includes(type))
                return new Error(
                    `Could not interpret punishment "${chalk.redBright(punishment)}".`
                )
            properties.type = <"mute" | "kick" | "ban">type

            const rawLength = punishment
                .slice(typeMatch[0].length)
                .trim()
                .replace(/^for +?/i, "")
            if (rawLength) {
                if (type === "kick")
                    return new Error(`Punishment type "kick" does not accept a length.`)

                const length = permanent.includes(rawLength)
                    ? Infinity
                    : parseDuration(rawLength)
                if (!length)
                    return new Error(
                        `Could not interpret length ${chalk.redBright(rawLength)}.`
                    )
                properties.length = length
            } else if (!rawLength && type !== "kick")
                return new Error(
                    `Missing punishment length in ${chalk.redBright(punishment)}.`
                )

            parsed.push(properties)
        }

        return parsed
    }

    // return first punishment for now, todo: check punishment history
    static processPunishment(
        punishments: PunishmentProperties[],
        properties: ActionProperties
    ): PunishmentAction {
        return new PunishmentAction({ ...punishments[0], ...properties })
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

export type PunishmentProperties = {
    type: "null" | "mute" | "kick" | "ban"
    length?: number
}

const permanent = [
    "forever",
    "ever",
    "permanent",
    "permanently",
    "infinity",
    "infinite",
    "inf",
    "∞",
    "until the end of times"
]
