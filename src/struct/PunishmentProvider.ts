import Discord from "discord.js"
import Client from "./Client"

export default class PunishmentProvider {
    client: Client
    constructor(client: Client) {
        this.client = client
    }

    async mute(member: Discord.GuildMember, reason: string, length: number) {
        const role = this.client.config.muteRole
        await member.roles.add(role)
    }

    async kick(member: Discord.GuildMember, reason: string) {
        await member.kick()
    }

    async ban(member: Discord.GuildMember, reason: string, length: number) {
        await member.ban()
    }
}
