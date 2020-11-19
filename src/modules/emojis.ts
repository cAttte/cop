import Joi from "joi"
import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import * as Twemoji from "twemoji-parser"
import Discord from "discord.js"
import Module from "../struct/Module"
import { PunishmentProperties } from "../struct/PunishmentProvider"
import createMessageMatcher from "../util/createMessageMatcher"

export default new Module({
    configSchema: {
        limit: Joi.number().integer().allow(Infinity).max(2000).default(12),
        delete: boolean.default(true),
        punishment: punishment
    },
    events: createMessageMatcher({
        module: "Emojis",
        reason: "Emoji spam",
        matcher(
            config: {
                limit: number
                delete: boolean
                punishment: PunishmentProperties[]
            },
            message: Discord.Message
        ) {
            const unicodeEmoji = Twemoji.parse(message.content)
            const discordEmoji = message.content.match(/<a?:[_a-zA-Z0-9]{2,32}:\d{18}>/g)
            const emojiCount = unicodeEmoji.length + (discordEmoji?.length || 0)

            if (emojiCount > config.limit) return true
            else return false
        }
    })
})
