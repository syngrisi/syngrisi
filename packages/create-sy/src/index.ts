// noinspection ExceptionCaughtLocallyJS
import * as utils from './utils.js'
import { DOCKER_SETUP_MANUAL_URL, MONGODB_SETUP_MANUAL_URL, NODE_VERSION } from './constants.js'
import chalk from 'chalk'
import { getSyngrisiVersion, runProgram } from './utils.js'
import path from 'node:path'
import fs from 'node:fs/promises'
import { ProgramOpts } from './types'
import { readPackageUp } from 'read-pkg-up'

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

        const dirParam = args._[0] || '.'
        const installDir = dirParam !== '.' ? dirParam : utils.getDirectoryName()

        return createSyngrisiProject({
            force: args.force,
            installDir,
            npmTag: args.npmTag || ''
        })
    } catch (error: any) {
        console.error(chalk.red(error.message))
    }
}

export async function createSyngrisiProject(opts: ProgramOpts) {
    let npmTag = ''
    if (opts.npmTag) {
        npmTag = opts.npmTag?.startsWith('@') ? opts.npmTag : `@${opts.npmTag}`
    }

    const root = opts.installDir

    /**
     * check if a package.json exists and if not create one
     */
    const project = await readPackageUp({ cwd: root })

    if (!project) {
        await fs.mkdir(root, { recursive: true })
        await fs.writeFile(
            path.resolve(root, 'package.json'),
            JSON.stringify({
                name: 'syngrisi_new_project',
                // type: 'module'
            }, null, 2)
        )

        /**
         * create a package-lock.json
         */
        await runProgram('npm', ['install'], { cwd: root, stdio: 'ignore' })
    }
    console.log(chalk.green(`\nInstalling ${chalk.bold('Syngrisi')}`))

    await runProgram('npm', ['install', `syngrisi${npmTag}`], { cwd: root, stdio: 'ignore' })

    console.log(chalk.green.bold(`✔ Syngrisi '${getSyngrisiVersion(root)}' version has been successfully installed\n`))
    // console.log(chalk.whiteBright.bold('Run "npm start" if you want to run it natively (requires MongoDB), or "docker-compose up" to run it in a Docker container (requires Docker).\n'
    //     + 'Read "README.md" for detailed configuration information.\n'))
}
