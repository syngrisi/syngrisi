import { ProgramOpts } from './types'
import { readPackageUp } from 'read-pkg-up'
import fs from 'node:fs/promises'
import path from 'node:path'
import ora from 'ora'
import chalk from 'chalk'
import { getSyngrisiVersion, printAndExit, runProgram } from './utils.js'

export const createSyngrisiProject = async (opts: ProgramOpts) => {
    if (!opts.installDir) {
        printAndExit('installDir is empty')
        return
    }
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

    console.log(chalk.green(`✔ Syngrisi ${chalk.greenBright(getSyngrisiVersion(root))} successfully installed in the following directory: ${root}`))
    console.log(chalk.white(`To run the application use the ${chalk.whiteBright('npx sy')} command`))
    console.log(chalk.white.bold('For detailed configuration see https://github.com/syngrisi/syngrisi/tree/main/packages/syngrisi'))
}
