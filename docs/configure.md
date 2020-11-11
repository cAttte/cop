# 🔧 Configure

The configuration file is cop's most essential node of customization; as cop's main premise is minimalism, it doesn't have any commands. The configuration uses [YAML][], and is stored at the [`config.yml`][config.yml] file on the root directory.

The default config should mostly be fine, but you're encouraged to customize everything you have access to, as your server's guidelines may not be as strict or lenient as the defaults.

The main settings are listed here:

## token

The Discord token of your bot.

-   **Required**
-   **Type:** `string`

## mute role

The ID of the role given to users when muting them. You may have to enclose it in quotes.

For now, cop does not setup its permissions, and, when not specified, you won't be able to choose _mute_ punishments.

-   **Type:** `string`

## modules

The configuration for the modules you wish to enable. Check out the [Modules][] section to see all of them, and their possible setttings.

If any of the default modules are missing, they'll be disabled and you will be warned from the console.

<!-- references -->

[yaml]: https://en.wikipedia.org/wiki/YAML
[config.yml]: https://github.com/cAttte/cop/blob/master/config.yml
[modules]: https://github.com/cAttte/cop/blob/master/docs/modules.md
