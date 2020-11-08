type ExceptionList = {
    [key: string]: string[]
}

export default function handleExceptionLists(
    exceptions: { allow: ExceptionList; deny: ExceptionList },
    instance: { [key: string]: string }
): boolean {
    const type = exceptions.allow && !exceptions.deny ? "allow" : "deny"
    const list = exceptions[type]
    let includes = false

    for (const attribute in list) {
        if (exceptions[attribute].includes(instance[attribute])) {
            includes = true
        }
    }

    return type === "allow" ? includes : !includes
}
