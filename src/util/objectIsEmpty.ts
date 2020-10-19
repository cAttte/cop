export default function objectIsEmpty(object: object): boolean {
    return object.constructor === Object && Object.keys(object).length === 0
}
