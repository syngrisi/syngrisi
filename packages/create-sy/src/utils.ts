import { c } from './native/colors.js'
import child_process, { SpawnOptions } from 'node:child_process'
import fss from 'node:fs'
import { confirm } from './native/prompt.js'
import { MONGODB_VERSION, NODE_VERSION } from './constants.js'
import semver from 'semver'
import path from 'node:path'
import spawn from 'cross-spawn'
import { Arguments } from './types'

/**
 * Validates npmTag to prevent command injection and ensure valid format.
 * Allows: semantic versions (1.2.3), version ranges (^1.2.3), tags (latest, beta, next)
 */
export const validateNpmTag = (tag: string): { valid: boolean; error?: string } => {
    if (!tag) {
        return { valid: true }
    }

    // Remove leading @ if present
    const cleanTag = tag.startsWith('@') ? tag.slice(1) : tag

    // Check for dangerous characters that could be used for command injection
    const dangerousChars = /[;&|`$(){}[\]<>\\!#*?"'\n\r]/
    if (dangerousChars.test(cleanTag)) {
        return {
            valid: false,
            error: `Invalid npmTag: contains forbidden characters. Got: '${tag}'`
        }
    }

    // Allow semantic versions (with optional prefixes like ^ ~ >= etc)
    const semverPattern = /^[~^>=<]*\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/
    if (semverPattern.test(cleanTag)) {
        return { valid: true }
    }

    // Allow common npm tags (alphanumeric with dashes, max 50 chars)
    const tagPattern = /^[a-zA-Z][a-zA-Z0-9-]{0,49}$/
    if (tagPattern.test(cleanTag)) {
        return { valid: true }
    }

    // Allow just version number without prefix
    if (semver.valid(cleanTag)) {
        return { valid: true }
    }

    return {
        valid: false,
        error: `Invalid npmTag format. Expected semantic version (e.g., 2.3.4) or tag name (e.g., latest, beta). Got: '${tag}'`
    }
}

export const checkNodeVersion = (): { supported: boolean, version: string } => {
    const unsupportedNodeVersion = !semver.satisfies(process.version, NODE_VERSION)
    return {
        supported: !unsupportedNodeVersion,
        version: process.version
    }

}
export const checkDocker = (): boolean => {
    try {
        child_process.execSync('docker-compose -v')
        console.log(c.green('✔ Docker Compose is installed.'))
        return true
    } catch (err) {
        console.log(c.yellow(String(err)))
        return false
    }
}

// export const checkEmptyDirectory = (directory: string): boolean => {
//     return fs.readdirSync(directory).length <= 0
// }

export const getDirectoryName = (): string => process.cwd()

export const getSyngrisiVersion = (installDir: string) => {
    return JSON.parse(fss.readFileSync(path.join(installDir, 'package.json')).toString()).dependencies?.syngrisi
}

export const getCreateSyVersion = (): string => {
    try {
        // Get the path to create-sy's package.json
        const packageJsonPath = new URL('../package.json', import.meta.url)
        const packageJson = JSON.parse(fss.readFileSync(packageJsonPath, 'utf-8'))
        return packageJson.version
    } catch (error) {
        console.error(c.yellow('⚠️ Could not read create-sy version, using latest'))
        return 'latest'
    }
}

export const installDependencies = (directory: string): void => {
    child_process.execSync('npm install', { cwd: directory, stdio: 'inherit' })
}

export const prompt = async (message: string): Promise<boolean> => {
    return confirm(message, true)
}

export const getInstalledMongoVersion = (): string => {
    const versionOutput = child_process.execSync('mongod --version').toString()
    const versionMatch = versionOutput.match(/db version v(\d+\.\d+\.\d+)/)
    if (!versionMatch) {
        throw new Error(c.red(`❌ Cannot parse MongoDB version, output: '${versionOutput}'`))
    }
    return versionMatch[1]
}
export const checkMongoDB = (): { version: string, supported: boolean } => {
    try {
        const installedVersion = getInstalledMongoVersion()
        if (!semver.satisfies(installedVersion, MONGODB_VERSION)) {
            console.error(c.red(`❌ MongoDB version is not satisfies requirements: '${MONGODB_VERSION}'. Installed version is '${installedVersion}'.`))
            return { version: installedVersion, supported: false }
        }
        console.log(c.green(`✔ MongoDB version is satisfactory. Installed version is ${installedVersion}.`))
        return { version: installedVersion, supported: true }
    } catch (error: any) {
        console.error(c.yellow(`Error checking MongoDB version: ${error.message}`))
        return { version: 'unknown', supported: false }
    }
}

export function printAndExit(error?: string, signal?: NodeJS.Signals | null) {
    if (signal === 'SIGINT') {
        console.log('\n\nGoodbye 👋')
    } else {
        console.error(`\n\nRuntime error: '${error}'`)
    }
    process.exit(1)
}

export function parseArguments(): Arguments {
    const args = process.argv.slice(2)
    const result: Arguments = { _: [] }

    for (let i = 0; i < args.length; i++) {
        const arg = args[i]

        if (arg === '--help' || arg === '-h') {
            result.help = true
        } else if (arg === '-f' || arg === '--force') {
            result.force = true
        } else if (arg === '-y' || arg === '--yes') {
            result.yes = true
        } else if (arg.startsWith('--npmTag=')) {
            result.npmTag = arg.split('=')[1]
        } else if (arg === '--npmTag' && args[i + 1] && !args[i + 1].startsWith('-')) {
            result.npmTag = args[++i]
        } else if (!arg.startsWith('-')) {
            result._.push(arg)
        }
    }

    return result
}

export function runProgram(command: string, args: string[], options: SpawnOptions) {
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    return new Promise<void>((resolve, rejects) => {
        let error: Error
        child.on('error', (e) => (error = e))
        child.on('close', (code, signal) => {
            if (code !== 0) {
                const errorMessage = (error && error.message) || `Error calling: ${command} ${args.join(' ')}`
                printAndExit(errorMessage, signal)
                return rejects(errorMessage)
            }
            resolve()
        })
    })
}
