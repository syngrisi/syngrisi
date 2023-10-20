import chalk from 'chalk'
import child_process from 'node:child_process'
import fs from 'node:fs'
import inquirer from 'inquirer'
import clone from 'git-clone/promise.js'
import {  NODE_VERSION, REPO_URI } from './constants.js'
import semver from 'semver'
import minimist from 'minimist'
import path from 'node:path'

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
    return JSON.parse(fs.readFileSync(path.join(installDir, 'package.json')).toString()).version
}


export const cloneRepo = (destinationFolder: string) => clone(REPO_URI, destinationFolder)

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

export const parseArguments = (): any => minimist(process.argv.slice(2))
