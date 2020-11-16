# 🧩 Modules

This section lists all of the default modules provided by cop. If you feel like creating your own, check out the [Develop][docs/develop] section!

-   [Autoroles](#autoroles)
-   [Emojis](#emojis)
-   [Empty messages](#empty-messages)
-   [Invites](#invites)
-   [Links](#links)
-   [Nick hoist](#nick-hoist)
-   [Text walls](#text-walls)

## autoroles

This module gives certain roles to new users as soon as they join. Useful if you want to be annoying and spam-ping your poor, poor members with announcements they don't care about. Or, if you want to give them pretty colors. Whatever floats your boat.

### roles

-   The list of role (IDs) to give. You can specify an array/list of IDs if you're using cop in a single server, or a map/object mapping server IDs to their autorole IDs. For example:

```yml
roles: ["720990739961741364", "707403823920054333"] # role IDs
# or
roles:
    690908396404080650: # server ID
        - "720990739961741364" # role ID
        - "707403823920054333" # role ID
```

-   **Type:** `array<string>` or `object<string, array<string>>`
-   **Default:** `none`

## emojis

This module filters the exaggerated usage of emojis (or any usage, if you're into that). It detects both default (Unicode) and custom (Discord) emojis.

### limit

-   The maximum number of emojis there can be in a message before it is considered 'spam' (yes,&nbsp;it&nbsp;can&nbsp;be&nbsp;`0`).
-   **Type:** `number` (max. `2000`)
-   **Default:** `12`

### delete

-   Whether to delete the message.
-   **Type:** [`boolean`][types/boolean]
-   **Default:** `yes`

### punishment

-   The punishment to execute on the user.
-   **Type:** [`Punishment`][types/punishment]
-   **Default:** `none`

## empty messages

This module filters empty messages, detecting several blank characters (` `,&nbsp;`឵`,&nbsp;`​`,&nbsp;`\n`...), and strategies (like using markdown).

### delete

-   Whether to delete the message.
-   **Type:** [`boolean`][types/boolean]
-   **Default:** `yes`

### punishment

-   The punishment to execute on the user.
-   **Type:** [`Punishment`][types/punishment]
-   **Default:** `none`

## invites

This module will filter server invites, detecting several domains (`discord.gg`,&nbsp;`discord.com/invite`), including vanity domains (`discord.io`,&nbsp;`discord.me`,&nbsp;`discord.li`...).

### validate

-   Whether to check the invites and make sure they are valid before acting upon them.
-   **Type:** [`boolean`][types/boolean]
-   **Default:** `yes`

### validation limit

-   Used in conjunction with `validate`. The maximum number of invites there can be in a message before stopping validation (and counting the invites as valid either way). Useful if you don't want spammers to post 50 invites per message and get you banned from Discord's API.
-   **Type:** `number`
-   **Default:** `Infinity` (no limit)

### delete

-   Whether to delete the message.
-   **Type:** [`boolean`][types/boolean]
-   **Default:** `yes`

### punishment

-   The punishment to execute on the user.
-   **Type:** [`Punishment`][types/punishment]
-   **Default:** `none`

## links

This module filters links. Nothing more and nothing less.

### delete

-   Whether to delete the message.
-   **Type:** [`boolean`][types/boolean]
-   **Default:** `yes`

### punishment

-   The punishment to execute on the user.
-   **Type:** [`Punishment`][types/punishment]
-   **Default:** `none`

## nick hoist

This module filters usernames or nicknames starting with characters for the purpose of appearing at the top of member or VC lists (ie, _hoisting_), such as `!`, `.`, etc.

### mode

-   How to unhoist nicknames. If `replace`, the hoisting characters will be replaced with similar-looking characters that do not hoist (eg,&nbsp;`! name`&nbsp;→&nbsp;`ⵑ name`). If `remove`, the hoisting characters will be removed (eg,&nbsp;`! name`&nbsp;→&nbsp;`name`). If `prefix`, the nicknames will be prefixed with an [invisible character][u17b5] (eg,&nbsp;`! name`&nbsp;→&nbsp;`឵! name`), which will move the member to the bottom of the list.
-   **Type:** `replace` or `remove` or `prefix`
-   **Default:** `replace`

### punishment

-   The punishment to execute on the user.
-   **Type:** [`Punishment`][types/punishment]
-   **Default:** `none`

## text walls

This module filters text walls; messages that occupy big portions of other users' screens when shared (what a fancy description!). It does not yet have a way to control the length (or width) the lines span, but the number of lines (or height) should be enough of a measurement.

### max lines

-   The maximum number of lines in a message before it is considered a text wall.
-   **Type:** `number` (max. `2000`)
-   **Default:** `12`

### delete

-   Whether to delete the message.
-   **Type:** [`boolean`][types/boolean]
-   **Default:** `yes`

### punishment

-   The punishment to execute on the user.
-   **Type:** [`Punishment`][types/punishment]
-   **Default:** `none`

<!-- references -->

[docs/develop]: https://github.com/cAttte/cop/blob/master/docs/develop.md
[types/boolean]: https://github.com/cAttte/cop/blob/master/docs/configure.md#boolean
[types/punishment]: https://github.com/cAttte/cop/blob/master/docs/configure.md#punishment
[u17b5]: https://unicode-table.com/en/17B5/
