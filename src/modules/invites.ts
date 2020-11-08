import Joi from "joi"
import Discord from "discord.js"
import boolean from "../schema/boolean"
import punishment from "../schema/punishment"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import DeleteAction from "../struct/action/DeleteAction"
import PunishmentAction, { PunishmentProperties } from "../struct/action/PunishmentAction"

export default new Module({
    configSchema: {
        validate: boolean.default(true),
        validationLimit: Joi.number().integer().allow(Infinity).default(Infinity),
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

        const inviteRegex = /(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|discord(?:app)?\.com\/invite)\/([A-Z0-9\-]+)/gi
        const invites: string[] = []
        let matches: RegExpExecArray
        while ((matches = inviteRegex.exec(message.content))) invites.push(matches[1])
        if (invites.length === 0) return

        if (config.validate && invites.length <= config.validationLimit) {
            let valid = false
            for (const invite of invites) {
                const fetched = await this.fetchInvite(invite).catch(() => null)
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
                    module: "Invites",
                    target: message,
                    reason: "Posted invite" + (invites.length > 1 ? "s" : "")
                })
            )
        }

        if (config.punishment) {
            actions.push(
                PunishmentAction.processPunishment(config.punishment, {
                    module: "Invites",
                    target: message.member,
                    reason: "Posted invite" + (invites.length > 1 ? "s" : "")
                })
            )
        }

        return actions
    }
}
