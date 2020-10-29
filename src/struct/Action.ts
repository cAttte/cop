import Discord from "discord.js"

export default abstract class Action {
    type: string
    module: string
    target: Discord.Base
    reason: string
    detail?: string

    constructor(properties: any) {
        this.type = properties.type
        this.module = properties.module
        this.target = properties.target
        this.reason = properties.reason
        if (properties.detail) this.detail = properties.detail
    }

    abstract execute(): Promise<Discord.Base | Error>
    abstract formatError(message: string): string
    abstract formatSuccess(message: string): string
}
