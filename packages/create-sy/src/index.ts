// noinspection ExceptionCaughtLocallyJS
import * as utils from './utils.js'
import { DOCKER_SETUP_MANUAL_URL, MONGODB_SETUP_MANUAL_URL, NODE_VERSION } from './constants.js'
import chalk from 'chalk'
import { createSyngrisiProject } from './createSyngrisiProject.js'

export async function run() {
    try {
        const args = utils.parseArguments()

        if (args.help || args._.includes('--help')) {
            console.log(`
            Usage: syngrisi [DIRECTORY] [OPTIONS]

            DIRECTORY:
            Specify the directory where Syngrisi will be installed. If not provided, the current directory will be used.

            Options:
            -f, --force   Force the installation even if the checks are not passed
            -y, --yes     Automatically agree to continue the installation
            --help        Show usage information and exit
        `)
            return
        }

        if (args.yes === undefined && !args._.includes('--yes')) {
            const continueInstallation = await utils.prompt('Do you want to continue with the installation?')
            if (!continueInstallation) {
                console.log(chalk.yellow('❌ Installation canceled'))
                return
            }
        }

        if (args.force === undefined && !args._.includes('--force')) {
            if (!utils.checkDocker()) {
                console.log(chalk.yellow('⚠️ Docker Compose is not installed.'
                    + `Please install Docker Compose if you want to run Syngrisi inside containers. ${DOCKER_SETUP_MANUAL_URL}\n`))
            }
            if (!utils.checkMongoDB()) {
                console.log(chalk.yellow('⚠️ MongoDB is not installed.'
                    + `Please install MongoDB if you want to run Syngrisi in the native mode. ${MONGODB_SETUP_MANUAL_URL}\n`))
            }

            const versionObj = utils.checkNodeVersion()
            if (!versionObj.supported) {
                const msg = `❌ This version: '${versionObj.version}' of Node.js is not supported. Please use Node.js version ${NODE_VERSION}\n`
                console.log(chalk.yellow(msg))
                process.exitCode = 1
                throw new Error(msg)
            }
        }

        const dirParam = args._[0] || '.'
        const installDir = dirParam !== '.' ? dirParam : utils.getDirectoryName()

        return createSyngrisiProject({
            installDir,
            npmTag: args.npmTag || ''
        })
    } catch (error: any) {
        console.error(chalk.red(error.message))
    }
}

