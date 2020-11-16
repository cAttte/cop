import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import Discord from "discord.js"
import { parser } from "discord-markdown"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import DeleteAction from "../struct/action/DeleteAction"
import PunishmentAction, { PunishmentProperties } from "../struct/action/PunishmentAction"
import characters from "../data/blankCharacters"

export default new Module({
    configSchema: {
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
            delete: boolean
            punishment: PunishmentProperties[]
        },
        oldMessage: Discord.Message,
        newMessage?: Discord.Message
    ): Promise<Action[]> {
        const message = event === "message" ? oldMessage : newMessage
        if (event === "messageUpdate" && oldMessage.content === newMessage.content) return
        if (!message.content) return

        const charRegex = new RegExp("[" + characters.join("") + "]", "g")
        const parsed = parser(message.content)
        const text = astToText(parsed).trim()
        const stripped = text.replace(charRegex, "")
        if (stripped !== "") return

        const actions: Action[] = []
        if (config.delete) {
            actions.push(
                new DeleteAction({
                    module: "EmptyMessages",
                    target: message,
                    reason: "Empty message"
                })
            )
        }

        if (config.punishment) {
            actions.push(
                PunishmentAction.processPunishment(config.punishment, {
                    module: "EmptyMessages",
                    target: message.member,
                    reason: "Empty message"
                })
            )
        }

        return actions
    }
}

type Token = {
    type: string
    content: string | Token[]
}

function astToText(content: Token[], type?: string): string {
    let result = ""
    if (!content)
        switch (type) {
            // ↓ hack to make stuff such as mentions not be counted as empty
            //   the actual content doesn't really matter so we'll just use a random character
            case "discordUser":
            case "discordChannel":
            case "discordRole":
            case "discordEmoji":
            case "discordEveryone":
            case "discordHere":
                return "@"
            case "br":
            case "newline":
            case "escape":
                return ""
        }

    for (const token of content) {
        if (typeof token.content === "string") result += token.content
        else result += astToText(token.content, token.type)
    }
    return result
}
