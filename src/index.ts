import fs from "fs"
import YAML from "yaml"
import chalk from "chalk"
import logger from "./logger"
import { Schema } from "joi"
import normalizeConfig from "./util/normalizeConfig"
import stringifyObject from "./util/stringifyObject"

import Module from "./modules/Module"
const modules = {}

const loadedModules: any = {}

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

    for (const module in config.modules) {
        if (!modules[module]) {
            logger.warn(`Unknown module "${module}".`)
            continue
        }

        const moduleConfig: Module = config.modules[module]
        const configSchema: Schema = modules[module].configSchema
        const { error, value } = configSchema.validate(moduleConfig)

        if (error) {
            const message = error.details[0].message
            logger.error(`While validating config for "${module}" module: ${message}.`)
            process.exit(0)
        }
        loadedModules[module] = value

        logger.info(
            `Loaded module "${module}" with config ${chalk.yellowBright(
                stringifyObject(value)
            )}.`
        )
    }
}

main()
