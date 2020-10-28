import chalk from "chalk"
import Discord from "discord.js"
import Action from "./Action"

export default class DeleteAction extends Action {
    type = "delete"
    module: string
    reason: string
    target: Discord.Message

    async execute(): Promise<Discord.Message | Error> {
        if (this.target.deleted) return new Error("Message was already deleted.")
        const result = await this.target.delete().catch((e: Error) => e)
        return result
    }

    static formatGenericSuccess(target: Discord.Message) {
        const id = chalk.blueBright(target.id)
        const authorTag = chalk.blueBright(target.author.tag)
        const authorID = chalk.blueBright(target.author.id)
        return `Deleted message (${id}) by ${authorTag} (${authorID}).`
    }

    formatError(message: string): string {
        const id = chalk.blueBright(this.target.id)
        const authorTag = chalk.blueBright(this.target.author.tag)
        const authorID = chalk.blueBright(this.target.author.id)
        return `Could not delete message (${id}) by ${authorTag} (${authorID}): ${message}`
    }

    formatSuccess(reason: string): string {
        const success = DeleteAction.formatGenericSuccess(this.target).slice(0, -1)
        return `${success}: ${reason}`
    }
}
