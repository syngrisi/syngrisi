// noinspection ExceptionCaughtLocallyJS
import * as utils from './utils.js'
import { DOCKER_SETUP_MANUAL_URL, MONGODB_SETUP_MANUAL_URL, NODE_VERSION } from './constants.js'
import chalk from 'chalk'
import { runProgram } from './utils.js'
import path from 'node:path'
import fs from 'node:fs/promises'
import { ProgramOpts } from './types'
import { readPackageUp } from 'read-pkg-up'
import ora from 'ora'

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

            if (!utils.checkNodeVersion()) {
                const msg = `❌ This version: '${process.version}' of Node.js is not supported. Please use Node.js version ${NODE_VERSION}\n`
                console.log(chalk.yellow(msg))
                process.exitCode = 1
                throw new Error(msg)
            }
        }

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
            }, null, 2)
        )

        /**
         * create a package-lock.json
         */
        await runProgram('npm', ['install'], { cwd: root, stdio: 'ignore' })
    }
    const spinner = ora(chalk.green(`Installing ${chalk.bold('Syngrisi')}`)).start()
    await runProgram('npm', ['install', `syngrisi${npmTag}`], { cwd: root, stdio: 'ignore' })
    spinner.stop()

    console.log(chalk.green(`✔ Syngrisi ${chalk.greenBright(utils.getSyngrisiVersion(root))} successfully installed in the following directory: ${root}`))
    console.log(chalk.white(`To run the application use the ${chalk.whiteBright('npx sy')} command`))
    console.log(chalk.white.bold('For detailed configuration see https://github.com/viktor-silakov/syngrisi'))
}
