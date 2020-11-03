import chalk from "chalk"
import Discord from "discord.js"
import Action from "./Action"

export default class NickAction extends Action {
    type = "nick"
    target: Discord.GuildMember
    detail: string

    async execute(): Promise<Discord.GuildMember | Error> {
        if (!this.target.manageable)
            return new Error("Their highest role is above cop's.")
        const result = await this.target.setNickname(this.detail).catch((e: Error) => e)
        return result
    }

    formatError(message: string): string {
        const userTag = chalk.blueBright(this.target.user.tag)
        const userID = chalk.blueBright(this.target.user.id)
        return `Could not nickname ${userTag} (${userID}): ${message}`
    }

    formatSuccess(): string {
        const targetTag = chalk.blueBright(this.target.user.tag)
        const targetID = chalk.blueBright(this.target.user.id)
        const nick = chalk.blueBright(this.detail)
        return `Nicknamed ${targetTag} (${targetID}) as ${nick}.`
    }
}
