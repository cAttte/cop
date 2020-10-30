import Client from "./struct/Client"
import Action from "./struct/Action"
import logger from "./logger"

export default function createActionHandler(client: Client, handlers: Function[]) {
    return async function actionHandler(...data: any[]) {
        let actions: Action[] = []
        for (const handler of handlers) {
            const result = await handler.bind(client)(...data)
            if (result) actions = actions.concat(result)
        }

        // i know this is really bad but there are always going to be, at most, ~5 actions,
        // so performance isn't really a concern... i guess
        for (const action of actions) {
            actions = actions.filter(otherAction => {
                if (action.equals(otherAction) && action !== otherAction) {
                    action.merge(otherAction)
                    return false
                } else if (action.conflicts(otherAction)) {
                    this.logger.debug(
                        `Action of type "${action.type}" proposed by module ${otherAction.module} conflicts with that proposed by ${action.module}; opting for the latter.`
                    )
                    return false
                }
                return true
            })
        }

        for (const action of actions) {
            const result = action.execute()
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
