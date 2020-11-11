const fs = require("fs/promises")
const fetch = require("node-fetch")
const path = require("path")
const url = "https://data.iana.org/TLD/tlds-alpha-by-domain.txt"

async function main() {
    /** @type {Response} */
    const response = await fetch(url)
    const text = await response.text()
    const lines = text.split("\n").slice(0, -1)
    const tlds = lines.map(d => d.toLowerCase())
    const info = lines[0].replace(/^# /, "").replace("  ", " ")
    const version = (info.match(/version (\d+)/i) || [])[1]

    const stringified = JSON.stringify(tlds.slice(1), null, 4)
    const content = `
        // ${url}
        // ${info}

        export default ${stringified}\n`
        .replace(/\n {8}/g, "\n")
        .slice(1)

    await fs.writeFile(path.join(__dirname, "../src/data/tlds.ts"), content)
    console.log(`Version ${version}`)
}

main()
