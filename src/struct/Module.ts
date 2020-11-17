import Discord from "discord.js"
import { Schema } from "joi"
import Action from "./action/Action"

export default class Module implements ModuleOptions {
    configSchema: ConfigSchema
    events: EventList

    constructor(options: ModuleOptions) {
        this.configSchema = options.configSchema
        this.events = options.events
    }
}

type ConfigSchema = {
    [key: string]: Schema
}

type ModuleOptions = {
    configSchema: ConfigSchema
    events: EventList
}

// prettier-ignore
export type EventList = {
    /** Emitted whenever a channel is created. */
    channelCreate?: (config: any, channel: Discord.TextChannel) => Action[] | Promise<Action[]>
    /** Emitted whenever a channel is deleted. */
    channelDelete?: (config: any, channel: Discord.TextChannel) => Action[] | Promise<Action[]>
    /** Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information can be provided easily here - you need to manually check the pins yourself. */
    channelPinsUpdate?: (config: any, channel: Discord.TextChannel, time: Date) => Action[] | Promise<Action[]>
    /** Emitted whenever a channel is updated - e.g. name change, topic change, channel type change. */
    channelUpdate?: (config: any, oldChannel: Discord.TextChannel, newChannel: Discord.TextChannel) => Action[] | Promise<Action[]>
    /** Emitted for general debugging information. */
    debug?: (config: any, info: string) => Action[] | Promise<Action[]>
    /** Emitted whenever a custom emoji is created in a guild. */
    emojiCreate?: (config: any, emoji: Discord.GuildEmoji) => Action[] | Promise<Action[]>
    /** Emitted whenever a custom emoji is deleted in a guild. */
    emojiDelete?: (config: any, emoji: Discord.GuildEmoji) => Action[] | Promise<Action[]>
    /** Emitted whenever a custom emoji is updated in a guild. */
    emojiUpdate?: (config: any, oldEmoji: Discord.GuildEmoji, newEmoji: Discord.GuildEmoji) => Action[] | Promise<Action[]>
    /** Emitted when the client encounters an error. */
    error?: (config: any, error: Error) => Action[] | Promise<Action[]>
    /** Emitted whenever a member is banned from a guild. */
    guildBanAdd?: (config: any, guild: Discord.Guild, user: Discord.User) => Action[] | Promise<Action[]>
    /** Emitted whenever a member is unbanned from a guild. */
    guildBanRemove?: (config: any, guild: Discord.Guild, user: Discord.User) => Action[] | Promise<Action[]>
    /** Emitted whenever the client joins a guild. */
    guildCreate?: (config: any, guild: Discord.Guild) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild kicks the client or the guild is deleted/left. */
    guildDelete?: (config: any, guild: Discord.Guild) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild integration is updated */
    guildIntegrationsUpdate?: (config: any, guild: Discord.Guild) => Action[] | Promise<Action[]>
    /** Emitted whenever a user joins a guild. */
    guildMemberAdd?: (config: any, member: Discord.GuildMember) => Action[] | Promise<Action[]>
    /** Emitted whenever a member leaves a guild, or is kicked. */
    guildMemberRemove?: (config: any, member: Discord.GuildMember) => Action[] | Promise<Action[]>
    /** Emitted whenever a chunk of guild members is received (all members come from the same guild). */
    guildMembersChunk?: (config: any, members: Discord.Collection<Discord.Snowflake, Discord.GuildMember>, guild: Discord.Guild, chunk: { index: number, count: number, nonce?: string }) => Action[] | Promise<Action[]>
    /** Emitted once a guild member changes speaking state. */
    guildMemberSpeaking?: (config: any, member: Discord.GuildMember, speaking: Readonly<Discord.Speaking>) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild member changes - i.e. new role, removed role, nickname. Also emitted when the user's details (e.g. username) change. */
    guildMemberUpdate?: (config: any, oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild becomes unavailable, likely due to a server outage. */
    guildUnavailable?: (config: any, guild: Discord.Guild) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild is updated - e.g. name change. */
    guildUpdate?: (config: any, oldGuild: Discord.Guild, newGuild: Discord.Guild) => Action[] | Promise<Action[]>
    /** Emitted when the client's session becomes invalidated. You are expected to handle closing the process gracefully and preventing a boot loop if you are listening to this event. */
    invalidated?: (config: any) => Action[] | Promise<Action[]>
    /** Emitted when an invite is created. This event only triggers if the client has `MANAGE_GUILD` permissions for the guild, or `MANAGE_CHANNEL` permissions for the channel. */
    inviteCreate?: (config: any, invite: Discord.Invite) => Action[] | Promise<Action[]>
    /** Emitted when an invite is deleted. This event only triggers if the client has `MANAGE_GUILD` permissions for the guild, or `MANAGE_CHANNEL` permissions for the channel. */
    inviteDelete?: (config: any, invite: Discord.Invite) => Action[] | Promise<Action[]>
    /** Emitted whenever a message is created. */
    message?: (config: any, message: Discord.Message) => Action[] | Promise<Action[]>
    /** Emitted whenever a message is deleted. */
    messageDelete?: (config: any, message: Discord.Message) => Action[] | Promise<Action[]>
    /** Emitted whenever messages are deleted in bulk. */
    messageDeleteBulk?: (config: any, messages: Discord.Collection<Discord.Snowflake, Discord.Message>) => Action[] | Promise<Action[]>
    /** Emitted whenever a reaction is added to a cached message. */
    messageReactionAdd?: (config: any, messageReaction: Discord.MessageReaction, user: Discord.User) => Action[] | Promise<Action[]>
    /** Emitted whenever a reaction is removed from a cached message. */
    messageReactionRemove?: (config: any, messageReaction: Discord.MessageReaction, user: Discord.User) => Action[] | Promise<Action[]>
    /** Emitted whenever all reactions are removed from a cached message. */
    messageReactionRemoveAll?: (config: any, message: Discord.Message) => Action[] | Promise<Action[]>
    /** Emitted when a bot removes an emoji reaction from a cached message. */
    messageReactionRemoveEmoji?: (config: any, reaction: Discord.MessageReaction) => Action[] | Promise<Action[]>
    /** Emitted whenever a message is updated - e.g. embed or content change. */
    messageUpdate?: (config: any, oldMessage: Discord.Message, newMessage: Discord.Message) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild member's presence (e.g. status, activity) is changed. */
    presenceUpdate?: (config: any, oldPresence: Discord.Presence | null, newPresence: Discord.Presence) => Action[] | Promise<Action[]>
    /** Emitted when the client hits a rate limit while making a request */
    rateLimit?: (config: any, rateLimitInfo: { timeout: number, limit: number, method: string, path: string, route: string }) => Action[] | Promise<Action[]>
    /** Emitted when the client becomes ready to start working. */
    ready?: (config: any) => Action[] | Promise<Action[]>
    /** Emitted whenever a role is created. */
    roleCreate?: (config: any, role: Discord.Role) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild role is deleted. */
    roleDelete?: (config: any, role: Discord.Role) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild role is updated. */
    roleUpdate?: (config: any, oldRole: Discord.Role, newRole: Discord.Role) => Action[] | Promise<Action[]>
    /** Emitted when a shard's WebSocket disconnects and will no longer reconnect. */
    shardDisconnect?: (config: any, event: Discord.CloseEvent, id: number) => Action[] | Promise<Action[]>
    /** Emitted whenever a shard's WebSocket encounters a connection error. */
    shardError?: (config: any, error: Error, shardID: number) => Action[] | Promise<Action[]>
    /** Emitted when a shard turns ready. */
    shardReady?: (config: any, id: number, unavailableGuilds?: Set<string>) => Action[] | Promise<Action[]>
    /** Emitted when a shard is attempting to reconnect or re-identify. */
    shardReconnecting?: (config: any, id: number) => Action[] | Promise<Action[]>
    /** Emitted when a shard resumes successfully. */
    shardResume?: (config: any, id: number, replayedEvents: number) => Action[] | Promise<Action[]>
    /** Emitted whenever a user starts typing in a channel. */
    typingStart?: (config: any, channel: Discord.Channel, user: Discord.User) => Action[] | Promise<Action[]>
    /** Emitted whenever a user's details (e.g. username) are changed. Triggered by the Discord gateway events USER_UPDATE, GUILD_MEMBER_UPDATE, and PRESENCE_UPDATE. */
    userUpdate?: (config: any, oldUser: Discord.User, newUser: Discord.User) => Action[] | Promise<Action[]>
    /** Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes. */
    voiceStateUpdate?: (config: any, oldState: Discord.VoiceState, newState: Discord.VoiceState) => Action[] | Promise<Action[]>
    /** Emitted for general warnings. */
    warn?: (config: any, info: string) => Action[] | Promise<Action[]>
    /** Emitted whenever a guild text channel has its webhooks changed. */
    webhookUpdate?: (config: any, channel: Discord.TextChannel) => Action[] | Promise<Action[]>
}
