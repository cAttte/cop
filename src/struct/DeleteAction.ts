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

    formatError(message: string): string {
        const id = chalk.blueBright(this.target.id)
        const authorTag = chalk.blueBright(this.target.author.tag)
        const authorID = chalk.blueBright(this.target.author.id)
        return `Could not delete message (${id}) by ${authorTag} (${authorID}): ${message}`
    }

    formatSuccess(): string {
        const id = chalk.blueBright(this.target.id)
        const authorTag = chalk.blueBright(this.target.author.tag)
        const authorID = chalk.blueBright(this.target.author.id)
        return `Deleted message (${id}) by ${authorTag} (${authorID}).`
    }
}
