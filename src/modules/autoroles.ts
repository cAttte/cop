import Joi from "joi"
import snowflake from "../schema/snowflake"
import Discord from "discord.js"
import chalk from "chalk"
import Module from "../struct/Module"
import Client from "../struct/Client"
import Action from "../struct/action/Action"
import RoleAction from "../struct/action/RoleAction"

export default new Module({
    configSchema: {
        roles: Joi.alternatives(
            Joi.array().items(snowflake).optional(),
            Joi.object().unknown()
        )
    },
    events: {
        async guildMemberAdd(
            this: Client,
            config: {
                roles?: string[] | { [key: string]: string[] }
            },
            member: Discord.GuildMember
        ): Promise<Action[]> {
            const roles = Array.isArray(config.roles)
                ? config.roles
                : config.roles[member.guild.id]
            if (!roles) return
            const actions: Action[] = []

            for (const role of roles) {
                const resolved = await member.guild.roles
                    .fetch(role, true)
                    .catch(() => null)
                if (!resolved) {
                    // prettier-ignore
                    this.logger.warn(`[Autoroles]: Couldn't resolve role by ID ${chalk.blueBright(role)}.`)
                    continue
                }

                actions.push(
                    new RoleAction({
                        module: "Autoroles",
                        target: member,
                        reason: "Auto-role",
                        detail: resolved
                    })
                )
            }

            return actions
        }
    }
})
