import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import Discord from "discord.js"
import { parser } from "discord-markdown"
import Module from "../struct/Module"
import Client from "../struct/Client"
import { PunishmentProperties } from "../struct/action/PunishmentAction"
import characters from "../data/blankCharacters"
import createMessageMatcher from "../util/createMessageMatcher"

export default new Module({
    configSchema: {
        delete: boolean.default(true),
        punishment: punishment
    },
    events: createMessageMatcher({
        module: "EmptyMessages",
        reason: "Empty message",
        async matcher(
            this: Client,
            config: { delete: boolean; punishment: PunishmentProperties },
            message: Discord.Message
        ) {
            const charRegex = new RegExp("[" + characters.join("") + "]", "g")
            const parsed = parser(message.content)
            const text = astToText(parsed).trim()
            const stripped = text.replace(charRegex, "")

            return stripped === ""
        }
    })
})

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
