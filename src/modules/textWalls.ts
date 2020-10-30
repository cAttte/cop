import width from "string-pixel-width"
import Joi from "joi"
import boolean from "../schema/boolean"
import Discord from "discord.js"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/Action"
import DeleteAction from "../struct/DeleteAction"

export default new Module({
    configSchema: Joi.object({
        maxLines: Joi.number().max(2000),
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
        config: { maxLines: number; delete: boolean },
        oldMessage: Discord.Message,
        newMessage?: Discord.Message
    ): Promise<Action[]> {
        const message = event === "message" ? oldMessage : newMessage
        if (event === "messageUpdate" && oldMessage.content === newMessage.content) return
        if (!message.content) return
        if (message.author.id === this.user.id) return

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

        return actions
    }
}
