import { ProgramOpts } from './types'
import { readPackageUp } from './native/findPackageJson.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createSpinner } from './native/spinner.js'
import { c } from './native/colors.js'
import { getCreateSyVersion, getSyngrisiVersion, printAndExit, runProgram, validateNpmTag } from './utils.js'

export const createSyngrisiProject = async (opts: ProgramOpts) => {
    if (!opts.installDir) {
        printAndExit('installDir is empty')
        return
    }

    // Validate npmTag before using it
    if (opts.npmTag) {
        const validation = validateNpmTag(opts.npmTag)
        if (!validation.valid) {
            printAndExit(validation.error)
            return
        }
    }

    let npmTag = ''

    if (opts.npmTag) {
        // User explicitly specified a version/tag
        npmTag = opts.npmTag?.startsWith('@') ? opts.npmTag : `@${opts.npmTag}`
    } else {
        // Use create-sy version to install matching syngrisi version
        const createSyVersion = getCreateSyVersion()
        npmTag = `@${createSyVersion}`
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
    const spinner = createSpinner(c.green(`Installing ${c.bold('Syngrisi')}`)).start()
    await runProgram('npm', ['install', `@syngrisi/syngrisi${npmTag}`], { cwd: root, stdio: 'ignore' })
    spinner.stop()

    console.log(c.green(`✔ Syngrisi ${c.greenBright(getSyngrisiVersion(root))} successfully installed in the following directory: ${root}`))
    console.log(`To run the application use the ${c.whiteBright('npx sy')} command`)
    console.log(c.bold('For detailed configuration see https://github.com/syngrisi/syngrisi/tree/main/packages/syngrisi'))
}
