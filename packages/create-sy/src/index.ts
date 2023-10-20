// noinspection ExceptionCaughtLocallyJS

import * as utils from './utils.js'
import { DOCKER_SETUP_MANUAL_URL, MONGODB_SETUP_MANUAL_URL, NODE_VERSION, REPO_URI } from './constants.js'
import chalk from 'chalk'
import { getSyngrisiVersion } from './utils.js'

export async function run() {
    try {
        const args = utils.parseArguments()

        if (!args.force) {
            const continueInstallation = await utils.prompt('Do you want to continue with the installation?')
            if (!continueInstallation) {
                console.log(chalk.yellow('❌ Installation canceled'))
                return
            }
        }

        if (!utils.checkDocker()) {
            console.log(chalk.yellow('⚠️ Docker Compose is not installed.'
                + `Please install Docker Compose if you want to run Syngrisi inside containers. ${DOCKER_SETUP_MANUAL_URL}`))
        }
        if (!utils.checkMongoDB()) {
            console.log(chalk.yellow('⚠️ MongoDB is not installed.'
                + `Please install MongoDB if you want to run Syngrisi in the native mode. ${MONGODB_SETUP_MANUAL_URL}`))
        }

        if (!utils.checkNodeVersion()) {
            const msg = `❌ This version: '${process.version}' of Node.js is not supported. Please use Node.js version ${NODE_VERSION}`
            console.log(chalk.yellow(msg))
            process.exitCode = 1
            throw new Error(msg)
        }

        utils.checkNodeVersion()

        const installDir = args._[0] || '.'

        if (!utils.checkEmptyDirectory(installDir)) {
            const msg = `❌ The directory '${installDir}' is not empty! Please specify an empty directory.`
            console.log(chalk.red(msg))
            process.exitCode = 1
            throw new Error(msg)
        }

        const cloneDir = installDir !== '.' ? installDir : utils.getDirectoryName()

        console.log(`Cloning ${chalk.green(REPO_URI)} to ${chalk.green(cloneDir)}...`)
        await utils.cloneRepo(cloneDir)

        console.log(`Installing dependencies in ${chalk.green(cloneDir)}...`)
        await utils.installDependencies(cloneDir)

        console.log(chalk.green.bold(`✔ Syngrisi '${getSyngrisiVersion(installDir)}' version has been successfully installed\n`))
        console.log(chalk.whiteBright.bold('Run "npm start" if you want to run it natively (requires MongoDB), or "docker-compose up" to run it in a Docker container (requires Docker).\n'
            + 'Read "README.md" for detailed configuration information.\n'))
    } catch (error: any) {
        console.error(chalk.red(error.message))
    }
}
