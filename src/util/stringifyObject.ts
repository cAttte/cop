export default function stringifyObject(thing: any): string {
    if (typeof thing === "object" && thing != null) {
        const entries = []
        for (const [key, value] of Object.entries(thing))
            entries.push(`${key}: ${stringifyObject(value)}`)
        return "( " + entries.join(", ") + " )"
    } else {
        return JSON.stringify(thing)
    }
}
