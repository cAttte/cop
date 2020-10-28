import Discord from "discord.js"

export default abstract class Action {
    module: string
    reason: string
    type: string
    target: Discord.Base
    detail: string

    constructor(properties: any) {
        this.module = properties.module
        this.reason = properties.reason
        this.type = properties.type
        this.target = properties.target
        this.detail = properties.detail
    }

    abstract execute(): Promise<Discord.Base | Error>
    abstract formatError(message: string): string
    abstract formatSuccess(message: string): string
}
