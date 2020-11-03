import width from "string-pixel-width"
import Discord from "discord.js"
import Joi from "joi"
import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import DeleteAction from "../struct/action/DeleteAction"
import PunishmentAction, { PunishmentProperties } from "../struct/action/PunishmentAction"

export default new Module({
    configSchema: {
        maxLines: Joi.number().max(2000).default(12),
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
            maxLines: number
            delete: boolean
            punishment: PunishmentProperties[]
        },
        oldMessage: Discord.Message,
        newMessage?: Discord.Message
    ): Promise<Action[]> {
        const message = event === "message" ? oldMessage : newMessage
        if (event === "messageUpdate" && oldMessage.content === newMessage.content) return
        if (!message.content) return

        // 1,200 is a semi-arbitrary number of pixels that roughly
        // equates to a single line in a Discord message.
        // this of course depends on each user but it's accurate enough, i think!
        let lines = 0
        for (const line of message.content.split("\n")) {
            const lineWidth = width(line, { size: 16 })
            const remainder = lineWidth % 1200
            const wrapValue = (lineWidth - remainder) / 1200
            lines += wrapValue + 1
        }
        if (lines <= config.maxLines) return

        const actions: Action[] = []
        if (config.delete) {
            actions.push(
                new DeleteAction({
                    module: "TextWalls",
                    target: message,
                    reason: "Text wall"
                })
            )
        }

        if (config.punishment) {
            actions.push(
                PunishmentAction.processPunishment(config.punishment, {
                    module: "TextWalls",
                    target: message.member,
                    reason: "Text wall"
                })
            )
        }

        return actions
    }
}
