import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import Discord from "discord.js"
import { parser } from "discord-markdown"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import DeleteAction from "../struct/action/DeleteAction"
import PunishmentAction, { PunishmentProperties } from "../struct/action/PunishmentAction"

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

const characters = [
    "\u0020", // Space
    "\u00A0", // No-Break Space
    "\u17B5", // Khmer Vowel Inherent Aa
    "\u2000", // En Quad
    "\u2001", // Em Quad
    "\u2002", // En Space
    "\u2003", // Em Space
    "\u2004", // Three-Per-Em Space
    "\u2005", // Four-Per-Em Space
    "\u2006", // Six-Per-Em Space
    "\u2007", // Figure Space
    "\u2008", // Punctuation Space
    "\u2009", // Thin Space
    "\u200A", // Hair Space
    "\u200B", // Zero Width Space
    "\u200C", // Zero Width Non-Joiner
    "\u200D", // Zero Width Joiner
    "\u200E", // Left-to-Right Mark
    "\u200F", // Right-to-Left Mark
    "\u2028", // Line Separator
    "\u2029", // Paragraph Separator
    "\u202F", // Narrow No-Break Space
    "\u205F", // Medium Mathematical Space
    "\u2800", // Braille Pattern Blank
    "\u3000", // Ideographic Space
    "\u3164", // Hangul Filler
    "\uFEFF", // Zero Width No-Break Space
    "\r", // Carriage Return
    "\n", // Newline
    "\t", // Tab
    "\f" // Form Feed
]
