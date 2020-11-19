import Discord from "discord.js"
import Client from "../Client"

export default abstract class Action implements ActionProperties {
    client: Client
    type: string
    module: string
    target: Discord.Base
    reason: string
    detail?: any

    constructor(client: Client, properties: ActionProperties) {
        this.client = client
        this.module = properties.module
        this.target = properties.target
        this.reason = properties.reason
        if (properties.detail) this.detail = properties.detail
    }

    equals(other: this): boolean {
        // 'id' is not a property of Discord.Base but all of its sub-classes have it.
        // we'll just cast it to any for simplicity
        return (
            this.type === other.type &&
            (<any>this.target).id === (<any>other.target).id &&
            this.detail === other.detail
        )
    }

    conflicts(other: this): boolean {
        return (
            this.type === other.type &&
            (<any>this.target).id === (<any>other.target).id &&
            this.detail !== other.detail
        )
    }

    merge(other: this): this {
        if (this.module !== other.module) this.module = `${this.module}, ${other.module}`
        if (this.reason !== other.reason) this.reason = `${this.reason}, ${other.reason}`
        return this
    }

    abstract execute(muteRole?: Discord.Role): Promise<Discord.Base | Error>
    abstract formatError(message: string): string
    abstract formatSuccess(): string
}

export type ActionProperties = {
    module: string
    target: Discord.Base
    reason: string
    detail?: any
}
