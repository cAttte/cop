import Joi from "joi"
import Discord from "discord.js"
import punishment from "../schema/punishment"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import NickAction from "../struct/action/NickAction"
import { PunishmentProperties } from "../struct/PunishmentProvider"
import PunishmentAction from "../struct/action/PunishmentAction"
import characters from "../data/hoistingCharacters"

export default new Module({
    configSchema: {
        mode: Joi.string().valid("replace", "remove", "prefix").default("replace"),
        punishment: punishment
    },
    events: {
        guildMemberAdd: createMemberHandler("guildMemberAdd"),
        guildMemberUpdate: createMemberHandler("guildMemberUpdate")
    }
})

function createMemberHandler(event: "guildMemberAdd" | "guildMemberUpdate") {
    return async function (
        this: Client,
        config: {
            mode: "replace" | "remove" | "prefix"
            punishment: PunishmentProperties[]
        },
        oldMember: Discord.GuildMember,
        newMember?: Discord.GuildMember
    ): Promise<Action[]> {
        const update = event === "guildMemberUpdate"
        if (update && oldMember.displayName === newMember.displayName) return
        const member = update ? newMember : oldMember

        const charPattern = "[" + Object.keys(characters).join("") + "]"
        const charRegex = new RegExp(`^${charPattern}+`, "g")
        if (!member.displayName.match(charRegex)) return

        let unhoisted = member.displayName
        if (config.mode === "replace")
            unhoisted = member.displayName.replace(charRegex, c => characters[c])
        else if (config.mode === "remove")
            unhoisted = member.displayName.replace(charRegex, "")
        else if (config.mode === "prefix")
            // prettier-ignore
            unhoisted = "\u17B5" + member.displayName

        const actions: Action[] = [
            new NickAction({
                module: "NickHoist",
                target: member,
                reason: "Hoisting nickname",
                detail: unhoisted
            })
        ]

        if (config.punishment) {
            actions.push(
                PunishmentAction.processPunishment(config.punishment, {
                    module: "NickHoist",
                    target: member,
                    reason: "Hoisting nickname"
                })
            )
        }

        return actions
    }
}
