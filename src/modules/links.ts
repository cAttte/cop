import Joi from "joi"
import fetch from "node-fetch"
import Discord from "discord.js"
import Client from "../struct/Client"
import boolean from "../schema/boolean"
import Module from "../struct/Module"
import { PunishmentProperties } from "../struct/action/PunishmentAction"
import createMessageMatcher from "../util/createMessageMatcher"
import tlds from "../data/topLevelDomains"

export default new Module({
    configSchema: {
        validate: boolean,
        validationLimit: Joi.number().integer().allow(Infinity).default(Infinity),
        delete: boolean
    },
    events: createMessageMatcher({
        module: "Links",
        reason: "Posted link",
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
            // modified version of https://stackoverflow.com/a/3809435
            const urlRegex = /(https?:\/\/)?(www\.)?([a-zA-Z0-9-._]{1,256})(\.[-a-zA-Z0-9]{2,6}){1,2}\b(\/[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)?/gi
            let links: string[] = []
            let matches: RegExpExecArray
            while ((matches = urlRegex.exec(message.content))) links.push(matches[1])

            // invites module takes care of this, so avoid duplicate punishment
            links = links.filter(url => {
                return !url.match(
                    /^(https?:\/\/)?(discord\.(gg|io|me|li)|discord(app)?\.com\/invite)/
                )
            })

            if (config.validate) {
                links = links.filter(url => {
                    const tld = url.match(/\.[a-z0-9]{2,6}$/i)?.[0]
                    if (!tld) return false
                    else if (tlds.includes(tld.toLowerCase())) return true
                    else return false
                })
            }
            if (links.length === 0) return false

            if (config.validate && links.length <= config.validationLimit) {
                let valid = false
                for (const link of links) {
                    const fetched = await fetch(link).catch(() => null)
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
