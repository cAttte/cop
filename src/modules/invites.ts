import Joi from "joi"
import Discord from "discord.js"
import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import Module from "../struct/Module"
import Client from "../struct/Client"
import { PunishmentProperties } from "../struct/PunishmentProvider"
import createMessageMatcher from "../util/createMessageMatcher"

export default new Module({
    configSchema: {
        validate: boolean.default(true),
        validationLimit: Joi.number().integer().allow(Infinity).default(Infinity),
        delete: boolean.default(true),
        punishment: punishment
    },
    events: createMessageMatcher({
        module: "Invites",
        reason: "Posted invite",
        async matcher(
            this: Client,
            config: {
                validate: boolean
                validationLimit: number
                delete: boolean
                punishment: PunishmentProperties[]
            },
            message: Discord.Message
        ) {
            const inviteRegex = /(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|discord(?:app)?\.com\/invite)\/([A-Z0-9\-]+)/gi
            const invites: string[] = []
            let matches: RegExpExecArray
            while ((matches = inviteRegex.exec(message.content))) invites.push(matches[1])
            if (invites.length === 0) return false

            if (config.validate && invites.length <= config.validationLimit) {
                let valid = false
                for (const invite of invites) {
                    const fetched = await this.fetchInvite(invite).catch(() => null)
                    if (fetched) {
                        valid = true
                        break
                    }
                }
                if (!valid) return false
            }

            return true
        }
    })
})
