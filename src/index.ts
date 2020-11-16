import fs from "fs"
import Joi from "joi"
import YAML from "yaml"
import chalk from "chalk"
import logger from "./logger"
import Discord from "discord.js"
import normalizeConfig from "./util/normalizeConfig"
import stringifyObject from "./util/stringifyObject"
import createActionHandler from "./actionHandler"
import Client from "./struct/Client"

import { Schema } from "joi"
import Module from "./struct/Module"
import emojis from "./modules/emojis"
import emptyMessages from "./modules/emptyMessages"
import invites from "./modules/invites"
import links from "./modules/links"
import nickHoist from "./modules/nickHoist"
import textWalls from "./modules/textWalls"
const modules = { emojis, emptyMessages, invites, links, nickHoist, textWalls }

const loadedConfig: { muteRole?: Discord.Role; modules: any } = { modules: {} }

async function main() {
    logger.debug("Loading config...")
    const data = await fs.promises
        .readFile("./config.yml")
        .then(buf => buf.toString())
        .catch((error: Error) => {
            logger.error(error.message)
            process.exit()
        })

    let config: any
    try {
        config = YAML.parse(data)
    } catch (error) {
        logger.error(`YAML Error: ${error.message}`)
        process.exit()
    }

    config = normalizeConfig(config)
    if (typeof config.modules !== "object")
        logger.warn("Module configuration missing; all modules are disabled.")
    if (!config.token) {
        logger.error("Discord token missing in config.")
        process.exit(0)
    }

    for (const module in config.modules) {
        if (!modules[module]) {
            logger.warn(`Unknown module ${chalk.yellowBright(module)}.`)
            continue
        }

        const moduleConfig: Module = config.modules[module]
        const configSchema: Schema = Joi.object(modules[module].configSchema)
        const { error, value } = configSchema.validate(moduleConfig)

        if (error) {
            const because = /^.+failed custom validation because /
            const message = error.details[0].message.replace(because, "")
            // prettier-ignore
            logger.error(`While validating config for ${chalk.yellowBright(module)} module: ${message}`)
            process.exit(0)
        }
        loadedConfig.modules[module] = value

        logger.info(`Loaded module ${chalk.yellowBright(module)} with config:`)
        logger.info(chalk.yellowBright(stringifyObject(value)))
    }

    const client = new Client({
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]
    })
    client.config = loadedConfig

    const before = Date.now()
    await client.login(config.token).catch((error: Error) => {
        logger.error(`While logging in to Discord: ${error.message}`)
        process.exit(0)
    })
    logger.info(`Logged in to Discord in ${Date.now() - before}ms.`)

    if (config.muteRole) {
        if (client.guilds.cache.size > 1)
            logger.warn("Bot is in multiple guilds, mute role will not be resolved.")
        else if (client.guilds.cache.size === 0)
            logger.warn("Bot is in no guilds, mute role will not be resolved.")
        else {
            const guild = client.guilds.cache.first()
            const role = await guild.roles.fetch(config.muteRole, true).catch(() => null)

            if (role instanceof Discord.Role) {
                const color = chalk.hex(role.hexColor)
                logger.info(`Resolved mute role ${color(role.name)}.`)
                loadedConfig.muteRole = role
            } else {
                logger.warn(`Could not resolve mute role with ID "${config.muteRole}".`)
            }
        }
    }

    let c = 0
    const eventHandlers: { [key: string]: Function[] } = {}
    for (const loadedModule in loadedConfig.modules) {
        const module: Module = modules[loadedModule]
        const moduleConfig = loadedConfig.modules[loadedModule]
        for (const event in module.events) {
            if (!eventHandlers[event]) eventHandlers[event] = []
            eventHandlers[event].push(module.events[event].bind(client, moduleConfig))
            c++
        }
    }
    logger.debug(`Registered ${c} event listeners.`)

    for (const event in eventHandlers) {
        const actionHandler = createActionHandler(client, eventHandlers[event])
        client.on(event, actionHandler)
    }
}

main()
