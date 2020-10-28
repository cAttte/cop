import Discord from "discord.js"
import chalk from "chalk"
import Joi from "joi"
import boolean from "../schema/boolean"
import Module from "../struct/Module"
import Client from "../struct/Client"

export default new Module({
    configSchema: Joi.object({
        validate: boolean,
        delete: boolean
    }),
    events: {
        message: createMessageHandler("message"),
        messageUpdate: createMessageHandler("messageUpdate")
    }
})

function createMessageHandler(event: "message" | "messageUpdate") {
    return async function (
        this: Client,
        config: { validate: boolean; delete: boolean },
        oldMessage: Discord.Message,
        newMessage?: Discord.Message
    ) {
        const message = event === "message" ? oldMessage : newMessage
        if (event === "messageUpdate" && oldMessage.content === newMessage.content) return
        if (!message.content) return

        const inviteRegex = /(?:https?:\/\/)?(?:discord\.gg|discord(?:app)?\.com\/invite)\/([A-Z0-9\-]+)/gi
        const invites = []
        let matches: RegExpExecArray
        while ((matches = inviteRegex.exec(message.content))) invites.push(matches[1])
        if (invites.length === 0) return

        let valid = !config.validate
        if (config.validate)
            for (const invite of invites) {
                const fetched = await this.fetchInvite(invite).catch(() => null)
                if (fetched) valid = true
            }
        if (!valid) return

        const tag = chalk.blueBright(message.author.tag)
        const s = invites.length > 1 ? "s" : ""
        if (config.delete) {
            await message
                .delete({ reason: `Invite${s}` })
                .then(() => this.logger.info(`[Invites] Deleted invite${s} by ${tag}.`))
                .catch((error: Error) =>
                    this.logger.warn(
                        `[Invites] Could not delete message by ${tag}: ${error.message}`
                    )
                )
        }
    }
}
