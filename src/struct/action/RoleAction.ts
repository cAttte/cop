import chalk from "chalk"
import Discord from "discord.js"
import Action from "./Action"

export default class RoleAction extends Action {
    type: "roleAdd" | "roleRemove"
    target: Discord.GuildMember
    reason: string
    detail: Discord.Role

    get method() {
        return this.type === "roleAdd" ? "add" : "remove"
    }

    get role() {
        return this.detail
    }

    async execute(): Promise<Discord.GuildMember | Error> {
        if (!this.target.manageable)
            return new Error("Their highest role is above cop's.")
        // prettier-ignore
        const result = await this.target.roles[this.method](this.detail, this.reason).catch((e: Error) => e)
        return result
    }

    formatError(message: string): string {
        const preposition = { add: "to", remove: "from" }[this.method]
        const roleName = chalk.hex(this.role.hexColor)(this.role.name)
        const roleID = chalk.blueBright(this.role.id)
        const targetTag = chalk.blueBright(this.target.user.tag)
        const targetID = chalk.blueBright(this.target.user.id)
        return `Could not ${this.method} ${roleName} (${roleID}) ${preposition} ${targetTag} (${targetID}): ${message}`
    }

    formatSuccess(): string {
        const preposition = { add: "to", remove: "from" }[this.method]
        const pastMethod = { add: "Added", remove: "Removed" }[this.method]
        const roleName = chalk.hex(this.role.hexColor)(this.role.name)
        const roleID = chalk.blueBright(this.role.id)
        const targetTag = chalk.blueBright(this.target.user.tag)
        const targetID = chalk.blueBright(this.target.user.id)
        return `${pastMethod} ${roleName} (${roleID}) ${preposition} ${targetTag} (${targetID}).`
    }
}
