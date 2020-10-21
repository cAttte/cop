import fs from "fs"
import YAML from "yaml"
import chalk from "chalk"
import logger from "./logger"
import normalizeConfig from "./util/normalizeConfig"
import stringifyObject from "./util/stringifyObject"

const modules = {}

async function main() {
    logger.debug("Loading config...")
    const data = await fs.promises
        .readFile("./config.yml", "utf-8")
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
            logger.warn(`Unknown module "${module}", ignoring.`)
            continue
        }

        const moduleConfig = config.modules[module]
        const configSchema = modules[module].configSchema

        logger.info(
            `Loaded module "${module}" with config ${chalk.yellowBright(
                stringifyObject(moduleConfig)
            )}.`
        )
    }
}

main()
