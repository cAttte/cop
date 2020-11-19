# 💻 Develop

This section of the docs will show you a lot on how cop works; whether you want to build a module for yourself or contribute directly to cop, this is for you! If you're exercising the latter, also check out the [Contribute][docs/contribute] section :)

-   [Scripts](#Scripts)
    -   [build](#build)
    -   [watch](#watch)
    -   [start](#start)
-   [API](#API)
    -   [Client](#-Client)
    -   [Module](#-Module)
    -   [Action](#-Action)
        -   [DeleteAction](#-DeleteAction)
        -   [NickAction](#-NickAction)
        -   [PunishmentAction](#-PunishmentAction)
        -   [RoleAction](#-RoleAction)
-   [Internals](#Internals)
    -   [data](#-data)
    -   [schema](#-schema)
    -   [util](#-util)
    -   [index](#-index)
    -   [actionHandler](#-actionHandler)
    -   [logger](#-logger)

## Scripts

### build

This is the lowest-level build script. It just calls the TypeScript compiler (`tsc`) with cop's [TS config][tsconfig].

    $ npm run build

### watch

Watch for code changes and build the code every time. Useful if you're making recurrent code changes. This script _won't_ restart the bot on changes.

    $ npm run watch

### start

Start the bot.

    $ npm start

## API

cop provides an object-oriented interface for easily developing extensions.

### [🡥][module] Module

To initialize a module, call the Module constructor like so:

```ts
new Module({ configSchema, eventList })
```

#### configSchema

A (normal, not joi) object whose values must be [joi][] Schemas. Here's an example:

```ts
const configSchema = {
    mode: Joi.string().valid("a", "b").default("b"),
    delete: Joi.boolean()
}
```

Check out the [custom schemas](#schema) that you can use in your config!

#### eventList

An object containing all of the module's event handlers, where the keys are the event names, and the values are the event handlers themselves. These must return an array of [Actions](#Action) (or a [Promise][] resolving therewith). Check djs' docs on [Client events][djs-events] for possible values. The `EventList` is typed, so you can code in peace! Here's an example:

```ts
const eventList = {
    message(message: Discord.Message): Action[] {
        return [
            new DeleteAction({
                module: "DeleteAllMessages",
                target: message,
                reason: "All messages must be exterminated."
            })
        ]
    }
}
```

### [🡥][client] Client

This is a simple sub-class of the `Discord.Client` class. It implements three properties: `logger`, of type `winston.Logger`, which is used for... you guessed it! logging; `punishment` a [`PunishmentProvider`](#-PunishmentProvider); and `config`, an object populated by the main file on start-up.

### [🡥][action] Action

Actions are little objects with instructions embedded into them. For example, you could have a deletion action (`DeleteAction`) that tells cop to delete a certain message by a certain user!

_But... why?_ Why be so verbose? Couldn't you just let the modules execute actions by themselves? (ie, `message.delete()`). Yes! But, what if I were to send a message that said `https://sh.it`, while having both the `links` and `profanity` modules enabled? Or a 15-line blank text-wall, while having both the `text walls` and `empty messages` modules enabled? Eureka! That will cause an error, as two modules will be trying to delete the same message.

The "main" [action handler][action-handler] will handle duplicated actions for you. It will also print neat logs, so you don't have to worry about that!

It may be a bit verbose, but sometimes verbosity is good! It also gives you _a lot_ of flexibility as to how you wanna handle actions or punishment, while still bringing a standard and monolithic way of doing so. Of course, if you really want to, you can skip using actions. But, we don't do that here.

Anywho, here's how you initialize an Action:

```ts
new Action({
    module: "ModuleName",
    target: target,
    reason: "Reason",
    detail: "Detail" // optional
})
```

(`Action` is an abstract class, so you'll want to instantiate one of its sub-classes, like `DeleteAction`!)

`module` is the name of the module, which will show up in the logs when the action is executed. `target` must be a sub-class of [`Discord.Base`][djs-base] (think, `Discord.Message`, `Discord.GuildMember`); the exact type depends on the action type (`Discord.Message` for `DeleteAction`, so on). `reason` is a string explaining _why_ the action was executed, it will show up in Discord's Audit Log. `detail` is a property only used in some actions, such as `NickAction`.

If the action you want to execute doesn't already exist, you're encouraged to create it! Here's how a custom Action sub-class could look like:

```ts
class SendAction extends Action {
    type = "send"
    target: Discord.TextChannel
    detail: string

    async execute(): Promise<Discord.TextChannel | Error> {
        return await this.target.send(this.detail).catch((e: Error) => e)
    }

    formatError(message: string): string {
        return `Could not delete message to #${this.target.name}.`
    }

    formatSuccess(): string {
        return `Sent message to #${this.target.name}.`
    }
}
```

#### [🡥][deleteaction] DeleteAction

An action that deletes a message. The `target` property is of type `Discord.Message`.

#### [🡥][nickaction] NickAction

An action that nicknames a user. The `target` property is of type `Discord.GuildMember`, and the `detail` property is of type `string`, describing what nickname to use.

#### [🡥][punishmentaction] PunishmentAction

An action that punishes a user, be it by muting, kicking, or banning them. The `detail` property (or its alias `length`) is of type `number`, and it represents how long the punishment will last for (therefore, this does not apply for punishment type `kick`).

This class also has two static methods: `parsePunishment()`, which will parse a punishment string (eg, `ban permanently`) into punishment properties (eg, `{ type: "ban", length: Infinity }`); and `processPunishment()`, which will receive a punishment sequence (eg, `mute for 12h, then ban permanently`) and decide which one should be executed by checking the user's history (ie, `mute for 12h` the first time, `ban permanently` the second time).

#### [🡥][roleaction] RoleAction

An action that adds or removes a role to/from a guild member. The `target` property is of type `Discord.GuildMember`, and the `detail` property is of type `Discord.Role`, describing what role to add/remove. The constructor accepts an extra parameter before the properties object, `type`, of type `"add"` or `"remove"`.

## Internals

cop's inner workings are also documented. This is useful if you're developing cop directly, or if your custom module needs some advanced extra-spicy stuff.

### [🡥][data] data

The `data/` directory contains datasets used by the built-in modules, such as a TLD list, character/replacement lists, etc.

### [🡥][schema] schema

The `schema/` directory contains several custom [joi][] schemas, such as [lenient booleans][schema/boolean], [punishment parsers][schema/punishment], and [Discord IDs][schema/snowflake]. Joi is used for config validation, so use these whenever possible in your module's config.

### [🡥][util] util

The `util/` directory contains a bunch of utility functions, which may or may not be useful in your case.

#### [🡥][util/createmessagematcher] createMessageMatcher()

This is probably the most _utile_ utility function, so it get its own section! `createMessageMatcher()` is useful if you're making a module that handles messages (for example, a profanity filter). It handles the boilerplate of parsing punishment, instantiating a `DeleteAction`, and `message` and `messageUpdate` events. You just pass it a `matcher` function that returns a `boolean`—representing whether the message matches your filter—and it will return an `EventList`. For example:

```ts
export default new Module({
    configSchema: {
        delete: boolean.default(true),
        punishment: punishment
    },
    eventList: createMessageMatcher({
        module: "DeleteAllMessages",
        reason: "All messages must be exterminated.",
        matcher(
            this: Client,
            config: { delete: boolean; punishment: PunishmentProperties }
        ) {
            return true // message will be deleted
            return false // message will not be deleted
        }
    })
})
```

If you want to have more events in your module, you can use object destructuring:

```ts
const eventList = {
    ...createMessageMatcher(/* ... */),
    guildMemberAdd(/* ... */) {
        /* ... */
    }
}
```

### [🡥][index] index

The `index` or main file is the _heart_ of cop. It will load the config from the `config.yml` file, validate the config for each module, register all of the event handlers, login to Discord, and everything else a bot must do on start-up.

### [🡥][actionhandler] actionHandler

The `createActionHandler()` function receives the event handlers provided by all of the modules for a certain event (eg, all `message` event handlers by the `invites`, `links`, etc. modules) and returns a single function which will call them all on each event emission. After calling these, it will decide which actions returned by the event handlers will be executed (ie, by merging duplicate actions and ignoring conflicting ones).

Essentially, the returned function is a "master" event handler; an event handler which calls multiple other event handlers.

### [🡥][logger] logger

The `logger` file exports a [`winston.Logger`][winston] object (who would've thought?!), which will log to the console with pretty colors, and to the `logs/` directory. You shouldn't import this file directly (unless you really want to...), but instead use the [`Client#logger`](#-Client) property.

<!-- references -->

[docs/contribute]: https://github.com/cAttte/cop/blob/master/docs/contribute.md
[tsconfig]: https://github.com/cAttte/cop/blob/master/tsconfig.json
[client]: https://github.com/cAttte/cop/blob/master/src/struct/Client.ts
[module]: https://github.com/cAttte/cop/blob/master/src/struct/Module.ts
[joi]: https://joi.dev/
[action-handler]: https://github.com/cAttte/cop/blob/master/src/actionHandler.ts
[djs-events]: https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
[action]: https://github.com/cAttte/cop/blob/master/src/struct/action/Action.ts
[deleteaction]: https://github.com/cAttte/cop/blob/master/src/struct/action/DeleteAction.ts
[nickaction]: https://github.com/cAttte/cop/blob/master/src/struct/action/NickAction.ts
[punishmentaction]: https://github.com/cAttte/cop/blob/master/src/struct/action/PunishmentAction.ts
[roleaction]: https://github.com/cAttte/cop/blob/master/src/struct/action/RoleAction.ts
[djs-base]: https://discord.js.org/#/docs/main/stable/class/Base
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[data]: https://github.com/cAttte/cop/blob/master/src/data
[schema]: https://github.com/cAttte/cop/blob/master/src/schema
[schema/boolean]: https://github.com/cAttte/cop/blob/master/src/schema/boolean.ts
[schema/punishment]: https://github.com/cAttte/cop/blob/master/src/schema/punishment.ts
[schema/snowflake]: https://github.com/cAttte/cop/blob/master/src/schema/snowflake.ts
[util]: https://github.com/cAttte/cop/blob/master/src/util
[util/createmessagematcher]: https://github.com/cAttte/cop/blob/master/src/util/createMessageMatcher.ts
[index]: https://github.com/cAttte/cop/blob/master/src/index.ts
[actionhandler]: https://github.com/cAttte/cop/blob/master/src/actionHandler.ts
[logger]: https://github.com/cAttte/cop/blob/master/src/logger.ts
[winston]: https://github.com/winstonjs/winston#readme
