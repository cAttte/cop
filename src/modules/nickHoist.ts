import Joi from "joi"
import Discord from "discord.js"
import chalk from "chalk"
import Module from "../struct/Module"
import Client from "../struct/Client"

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
    ) {
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

        let name = chalk.blueBright(member.user.tag)
        if (member.user.username !== member.displayName)
            name += " " + `(${chalk.blueBright(member.displayName)})`
        if (member.manageable) {
            await member
                .setNickname(unhoisted.slice(0, 32), "Unhoisted nickname")
                .then(() =>
                    this.logger.info(`[NickHoist] Unhoisted ${name} as "${unhoisted}".`)
                )
                .catch((error: Error) =>
                    this.logger.warn(
                        `[NickHoist]: Could not nickname ${name}: ${error.message}`
                    )
                )
        } else {
            this.logger.warn(
                `[NickHoist] Could not nickname ${name} as their highest role is above cop's.`
            )
        }
    }
}
