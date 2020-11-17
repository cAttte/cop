import width from "string-pixel-width"
import Discord from "discord.js"
import Joi from "joi"
import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import Module from "../struct/Module"
import Client from "../struct/Client"
import { PunishmentProperties } from "../struct/action/PunishmentAction"
import createMessageMatcher from "../util/createMessageMatcher"

export default new Module({
    configSchema: {
        maxLines: Joi.number().max(2000).default(12),
        delete: boolean.default(true),
        punishment: punishment
    },
    events: createMessageMatcher({
        module: "TextWalls",
        reason: "Text wall",
        async matcher(
            this: Client,
            config: {
                maxLines: number
                delete: boolean
                punishment: PunishmentProperties[]
            },
            message: Discord.Message
        ) {
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
            return lines <= config.maxLines
        }
    })
})
