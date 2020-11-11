import fetch from "node-fetch"
import Discord from "discord.js"
import Client from "../struct/Client"
import boolean from "../schema/boolean"
import Module from "../struct/Module"
import Action from "../struct/action/Action"
import DeleteAction from "../struct/action/DeleteAction"
import PunishmentAction, { PunishmentProperties } from "../struct/action/PunishmentAction"
import tlds from "../data/tlds"

export default new Module({
    configSchema: {
        validate: boolean,
        delete: boolean
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
            validate: boolean
            validationLimit: number
            delete: boolean
            punishment: PunishmentProperties[]
        },
        oldMessage: Discord.Message,
        newMessage?: Discord.Message
    ): Promise<Action[]> {
        const message = event === "message" ? oldMessage : newMessage
        if (event === "messageUpdate" && oldMessage.content === newMessage.content) return
        if (!message.content) return

        // modified version of https://stackoverflow.com/a/3809435
        const urlRegex = /(https?:\/\/)?(www\.)?([a-zA-Z0-9-._]{1,256})(\.[-a-zA-Z0-9]{2,6}){1,2}\b(\/[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)?/gi
        let links: string[] = []
        let matches: RegExpExecArray
        while ((matches = urlRegex.exec(message.content))) links.push(matches[1])
        if (config.validate) {
            links = links.filter(url => {
                const tld = url.match(/\.[a-z0-9]{2,6}$/i)?.[0]
                if (!tld) return false
                else if (tlds.includes(tld.toLowerCase())) return true
                else return false
            })
        }
        if (links.length === 0) return

        if (config.validate && links.length <= config.validationLimit) {
            let valid = false
            for (const link of links) {
                const fetched = await fetch(link).catch(() => null)
                if (fetched) {
                    valid = true
                    break
                }
            }
            if (!valid) return
        }

        const actions: Action[] = []
        if (config.delete) {
            actions.push(
                new DeleteAction({
                    module: "Links",
                    target: message,
                    reason: "Posted link" + (links.length > 1 ? "s" : "")
                })
            )
        }

        if (config.punishment) {
            actions.push(
                PunishmentAction.processPunishment(config.punishment, {
                    module: "Links",
                    target: message.member,
                    reason: "Posted link" + (links.length > 1 ? "s" : "")
                })
            )
        }

        return actions
    }
}
