import chalk from 'chalk'
import child_process, { SpawnOptions } from 'node:child_process'
import fs from 'node:fs'
import inquirer from 'inquirer'
import { NODE_VERSION } from './constants.js'
import semver from 'semver'
import minimist from 'minimist'
import path from 'node:path'
import spawn from 'cross-spawn'
import { Arguments } from './types'

export const checkNodeVersion = (): boolean => {
    const unsupportedNodeVersion = !semver.satisfies(process.version, NODE_VERSION)
    return !unsupportedNodeVersion

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

export const checkEmptyDirectory = (directory: string): boolean => {
    return fs.readdirSync(directory).length <= 0
}

export const getDirectoryName = (): string => process.cwd()

export const getSyngrisiVersion = (installDir: string) => {
    return JSON.parse(fs.readFileSync(path.join(installDir, 'package.json')).toString()).dependencies?.syngrisi
}

export const installDependencies = (directory: string): void => {
    child_process.execSync('npm install', { cwd: directory, stdio: 'inherit' })
}

export const prompt = async (message: string): Promise<string> => {
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

export const checkMongoDB = (): boolean => {
    try {
        child_process.execSync('mongod --version', { stdio: 'ignore' })
        console.log(chalk.green('✔ MongoDB is installed.'))
        return true
    } catch (error: any) {
        console.error(chalk.yellow(error.message))
        return false
    }
}

function printAndExit(error?: string, signal?: NodeJS.Signals | null) {
    if (signal === 'SIGINT') {
        console.log('\n\nGoodbye 👋')
    } else {
        console.log(`\n\n⚠️  Ups, something went wrong${error ? `: ${error}` : ''}!`)
    }

    process.exit(1)
}


export function parseArguments(): Arguments {
    const args: string[] = process.argv.slice(2)
    const parsedArgs: minimist.ParsedArgs = minimist(args)

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
