import Joi from "joi"
import Discord from "discord.js"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import NickAction from "../struct/action/NickAction"

const characters = {
    "!": "ⵑ",
    '"': "ʺ",
    "'": "ʹ",
    ".": "․",
    "#": "ⵌ"
}

export default new Module({
    configSchema: Joi.object({
        mode: Joi.string().valid("replace", "remove", "prefix")
    }),
    events: {
        guildMemberAdd: createMemberHandler("guildMemberAdd"),
        guildMemberUpdate: createMemberHandler("guildMemberUpdate")
    }
})

function createMemberHandler(event: "guildMemberAdd" | "guildMemberUpdate") {
    return async function (
        this: Client,
        config: { mode: "replace" | "remove" | "prefix" },
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

        return actions
    }
}
