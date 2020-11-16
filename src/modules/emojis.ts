import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import * as Twemoji from "twemoji-parser"
import Discord from "discord.js"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import DeleteAction from "../struct/action/DeleteAction"
import PunishmentAction, { PunishmentProperties } from "../struct/action/PunishmentAction"
import Joi from "joi"

export default new Module({
    configSchema: {
        limit: Joi.number().integer().allow(Infinity).max(2000).default(12),
        delete: boolean.default(true),
        punishment: punishment
    },
    events: {
        message: createMessageHandler("message"),
        messageUpdate: createMessageHandler("messageUpdate")
    }
})

function createMessageHandler(event: "message" | "messageUpdate") {
    return async function (
        this: Client,
        config: {
            limit: number
            delete: boolean
            punishment: PunishmentProperties[]
        },
        oldMessage: Discord.Message,
        newMessage?: Discord.Message
    ): Promise<Action[]> {
        const message = event === "message" ? oldMessage : newMessage
        if (event === "messageUpdate" && oldMessage.content === newMessage.content) return
        if (!message.content) return

        const emojiCount =
            Twemoji.parse(message.content).length +
            (message.content.match(/<a?:[_a-zA-Z0-9]{2,32}:\d{18}>/g)?.length || 0)
        if (emojiCount < config.limit) return

        const actions: Action[] = []
        if (config.delete) {
            actions.push(
                new DeleteAction({
                    module: "Emojis",
                    target: message,
                    reason: "Emoji spam"
                })
            )
        }

        if (config.punishment) {
            actions.push(
                PunishmentAction.processPunishment(config.punishment, {
                    module: "Emojis",
                    target: message.member,
                    reason: "Emoji spam"
                })
            )
        }

        return actions
    }
}
