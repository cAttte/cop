import objectIsEmpty from "./objectIsEmpty"

export default function normalizeConfig(object: any): any {
    const converted = {}
    for (const key in object) {
        const convertedKey = key.replace(/[ _-](\w)/g, (_, $1) => $1.toUpperCase())
        const value = object[key]
        const convertedValue = typeof value === "object" ? normalizeConfig(value) : value
        converted[convertedKey] = objectIsEmpty(convertedValue) ? null : convertedValue
    }
    return converted
}
