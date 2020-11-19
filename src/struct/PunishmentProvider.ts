import parseDuration from "parse-duration"
import chalk from "chalk"
import Discord from "discord.js"
import Client from "./Client"
import { ActionProperties } from "./action/Action"
import permanent from "../data/permanentLengths"

export type PunishmentType = "null" | "mute" | "kick" | "ban"
export type PunishmentProperties = { type: PunishmentType; length?: number }

export default class PunishmentProvider {
    client: Client
    constructor(client: Client) {
        this.client = client
    }

    async mute(member: Discord.GuildMember, reason: string, length: number) {
        const role = this.client.config.muteRole
        return await member.roles.add(role)
    }

    async kick(member: Discord.GuildMember, reason: string) {
        return await member.kick()
    }

    async ban(member: Discord.GuildMember, reason: string, length: number) {
        return await member.ban()
    }

    parsePunishment(input: string | string[]): PunishmentProperties[] | Error {
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
            properties.type = <PunishmentType>type

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
    processPunishment(
        punishments: PunishmentProperties[],
        properties: ActionProperties
    ): PunishmentProperties {
        return { ...punishments[0], ...properties }
    }
}
