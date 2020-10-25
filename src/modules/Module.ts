import { Schema } from "joi"

type EventList = { [key: string]: () => void }

export default class Module {
    configSchema: Schema
    events: EventList

    constructor(options: { configSchema: Schema; events: EventList }) {
        this.configSchema = options.configSchema
        this.events = options.events
    }
}
