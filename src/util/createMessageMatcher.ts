import Discord from "discord.js"
import Action from "../struct/action/Action"
import PunishmentAction, { PunishmentProperties } from "../struct/action/PunishmentAction"
import DeleteAction from "../struct/action/DeleteAction"

type MessageMatcherProperties = {
    matcher: (config: any, message: Discord.Message) => boolean
    module: string
    reason: string
}

export default function createMessageMatcher(properties: MessageMatcherProperties) {
    return {
        message: createMessageHandler("message", properties),
        messageUpdate: createMessageHandler("messageUpdate", properties)
    }
}

function createMessageHandler(
    event: "message" | "messageUpdate",
    properties: MessageMatcherProperties
) {
    return async function messageHandler(
        config: {
            delete: boolean
            punishment: PunishmentProperties[]
            [key: string]: any
        },
        oldMessage: Discord.Message,
        newMessage?: Discord.Message
    ) {
        const message = event === "message" ? oldMessage : newMessage
        if (event === "messageUpdate" && oldMessage.content === newMessage.content) return
        if (!message.content) return

        const actions: Action[] = []
        const matches = properties.matcher(config, message)

        if (matches) {
            if (config.delete) {
                actions.push(
                    new DeleteAction({
                        module: properties.module,
                        target: message,
                        reason: properties.reason
                    })
                )
            }

            if (config.punishment) {
                actions.push(
                    PunishmentAction.processPunishment(config.punishment, {
                        module: properties.module,
                        target: message.member,
                        reason: properties.reason
                    })
                )
            }
        }

        return actions
    }
}
