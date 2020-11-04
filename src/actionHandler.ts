import Client from "./struct/Client"
import Action from "./struct/action/Action"
import logger from "./logger"

export default function createActionHandler(client: Client, handlers: Function[]) {
    return async function actionHandler(...data: any[]) {
        let actions: Action[] = []
        for (const handler of handlers) {
            const result = await handler.bind(client)(...data)
            if (result) actions = actions.concat(result)
        }

        // i know this is kinda bad but there are always going to be, at most, ~5 actions,
        // so performance isn't really a concern i guess
        const mergedActions = []
        for (const otherAction of actions) {
            if (mergedActions.length) {
                for (const action of mergedActions) {
                    if (action.equals(otherAction)) {
                        action.merge(otherAction)
                    } else if (action.conflicts(otherAction)) {
                        this.logger.debug(
                            `Action of type "${action.type}" proposed by module ${otherAction.module} conflicts with that proposed by ${action.module}; opting for the latter.`
                        )
                    } else {
                        mergedActions.push(otherAction)
                    }
                }
            } else {
                mergedActions.push(otherAction)
            }
        }

        for (const action of mergedActions) {
            const result = await action.execute(client.config.muteRole)
            if (result instanceof Error) {
                const message = action.formatError(result.message)
                logger.warn(`[${action.module}] ${message}`)
            } else {
                const message = action.formatSuccess()
                logger.info(`[${action.module}] ${message}`)
            }
        }
    }
}
