import chalk from 'chalk'
import child_process, { SpawnOptions } from 'node:child_process'
import fss from 'node:fs'
import inquirer from 'inquirer'
import { MONGODB_VERSION, NODE_VERSION } from './constants.js'
import semver from 'semver'
import minimist from 'minimist'
import path from 'node:path'
import spawn from 'cross-spawn'
import { Arguments } from './types'

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
        console.log(chalk.green('✔ Docker Compose is installed.'))
        return true
    } catch (err) {
        console.log(chalk.yellow(err))
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

export const installDependencies = (directory: string): void => {
    child_process.execSync('npm install', { cwd: directory, stdio: 'inherit' })
}

export const prompt = async (message: string): Promise<boolean> => {
    const { answer } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'answer',
            default: 'y',
            message,
        },
    ])
    return answer
}

export const getInstalledMongoVersion = (): string => {
    const versionOutput = child_process.execSync('mongod1 --version').toString()
    const versionMatch = versionOutput.match(/db version v(\d+\.\d+\.\d+)/)
    if (!versionMatch) {
        throw new Error(chalk.red(`❌ Cannot parse MongoDB version, output: '${versionOutput}'`))
    }
    return versionMatch[1]
}
export const checkMongoDB = (): { version: string, supported: boolean } => {
    try {
        const installedVersion = getInstalledMongoVersion()
        if (!semver.satisfies(installedVersion, MONGODB_VERSION)) {
            console.error(chalk.red(`❌ MongoDB version is not satisfies requirements: '${MONGODB_VERSION}'. Installed version is '${installedVersion}'.`))
            return { version: installedVersion, supported: false }
        }
        console.log(chalk.green(`✔ MongoDB version is satisfactory. Installed version is ${installedVersion}.`))
        return { version: installedVersion, supported: true }
    } catch (error: any) {
        console.error(chalk.yellow(`Error checking MongoDB version: ${error.message}`))
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

export function getArgs() {
    const args: string[] = process.argv.slice(2)
    return minimist(args)
}

export function parseArguments(): Arguments {
    const parsedArgs: minimist.ParsedArgs = getArgs()

    // Handle shorthands
    parsedArgs.force = parsedArgs.force || parsedArgs.f
    parsedArgs.yes = parsedArgs.yes || parsedArgs.y

    return parsedArgs as Arguments
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
