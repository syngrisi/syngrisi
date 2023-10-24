import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest'
import { run } from '../src'
import { createSyngrisiProject } from '../src/createSyngrisiProject'
import { checkDocker, checkMongoDB, checkNodeVersion, parseArguments, prompt } from '../src/utils'
import * as path from 'node:path'
import chalk from 'chalk'
import { DOCKER_SETUP_MANUAL_URL, MONGODB_SETUP_MANUAL_URL } from '../src/constants'

const DOCKER_WARN = chalk.yellow('⚠️ Docker Compose is not installed.'
    + `Please install Docker Compose if you want to run Syngrisi inside containers. ${DOCKER_SETUP_MANUAL_URL}\n`)
const MONGO_WARN = chalk.yellow('⚠️ MongoDB is not installed.'
    + `Please install MongoDB if you want to run Syngrisi in the native mode. ${MONGODB_SETUP_MANUAL_URL}\n`)
const NODE_WARN = 'of Node.js is not supported. Please use Node.js version'

vi.mock('../src/utils', async () => {
    const actual = await vi.importActual('../src/utils')
    return {
        // @ts-ignore
        ...actual,
        parseArguments: vi.fn().mockReturnValue({ _: [], }),
        getArgs: vi.fn(),
        prompt: vi.fn(),
        checkDocker: vi.fn(),
        checkMongoDB: vi.fn(),
        checkNodeVersion: vi.fn(),
    }
})

vi.mock('../src/createSyngrisiProject', async () => {
    const actual = await vi.importActual('../src/createSyngrisiProject')
    return {
        // @ts-ignore
        ...actual,
        createSyngrisiProject: vi.fn(),
    }
})

const consoleLog = console.log.bind(console)
beforeEach(() => {
    console.log = vi.fn()
    vi.clearAllMocks()
})

describe('run', () => {
    it('run - without args, prompt: true, requirements: satisfied', async () => {
        vi.mocked(prompt).mockResolvedValue(true)
        vi.mocked(checkDocker).mockReturnValue(true)
        vi.mocked(checkMongoDB).mockReturnValue(true)
        vi.mocked(checkNodeVersion).mockReturnValue({ version: '14.0.20', supported: true })

        await run()

        expect(console.log).toBeCalledTimes(0)
        expect(checkDocker).toBeCalledTimes(1)
        expect(checkMongoDB).toBeCalledTimes(1)
        expect(checkNodeVersion).toBeCalledTimes(1)
        expect(createSyngrisiProject).toBeCalledTimes(1)
        const currentDir = path.resolve(__dirname, '..')
        expect(createSyngrisiProject).toBeCalledWith({ installDir: currentDir, npmTag: '' })
    })

    it('run - without args, prompt: false', async () => {
        vi.mocked(prompt).mockResolvedValue(false)

        await run()
        expect(vi.mocked(console.log).mock.calls[0][0]).toContain(chalk.yellow('❌ Installation canceled'))

        // console.error(console.log.mock.calls)
        expect(console.log).toBeCalledTimes(1)
        expect(checkDocker).toBeCalledTimes(0)
        expect(checkMongoDB).toBeCalledTimes(0)
        expect(checkNodeVersion).toBeCalledTimes(0)
        expect(createSyngrisiProject).toBeCalledTimes(0)
    })

    it('run - without args, prompt: true, requirements: dissatisfied', async () => {
        vi.mocked(prompt).mockResolvedValue(true)
        vi.mocked(checkDocker).mockReturnValue(false)
        vi.mocked(checkMongoDB).mockReturnValue(false)
        vi.mocked(checkNodeVersion).mockReturnValue({ version: '12.0.20', supported: false })

        await run()
        expect(vi.mocked(console.log).mock.calls[0][0]).toContain(DOCKER_WARN)
        expect(vi.mocked(console.log).mock.calls[1][0]).toContain(MONGO_WARN)
        expect(vi.mocked(console.log).mock.calls[2][0]).toContain(NODE_WARN)

        // console.error(console.log.mock.calls)

        expect(console.log).toBeCalledTimes(3)
        expect(checkDocker).toBeCalledTimes(1)
        expect(checkMongoDB).toBeCalledTimes(1)
        expect(checkNodeVersion).toBeCalledTimes(1)
        expect(createSyngrisiProject).toBeCalledTimes(0)
        // const currentDir = path.resolve(__dirname, '..');
        // expect(createSyngrisiProject).toBeCalledWith({ installDir: currentDir, npmTag: '' })
    })

    it('run - with args, { _: [ \'/test/path\' ], npmTag: \'latest\', force: true, yes: true }', async () => {
        vi.mocked(parseArguments).mockReturnValue({ _: ['/test/path'], npmTag: 'latest', force: true, yes: true } as any)
        vi.mocked(prompt).mockResolvedValue(true)
        vi.mocked(checkDocker).mockReturnValue(true)
        vi.mocked(checkMongoDB).mockReturnValue(true)
        vi.mocked(checkNodeVersion).mockReturnValue({ version: '14.0.20', supported: true })

        await run()
        // console.error(console.log.mock.calls)

        expect(console.log).toBeCalledTimes(0)
        expect(checkDocker).toBeCalledTimes(0)
        expect(checkMongoDB).toBeCalledTimes(0)
        expect(checkNodeVersion).toBeCalledTimes(0)
        expect(createSyngrisiProject).toBeCalledTimes(1)
        expect(createSyngrisiProject).toBeCalledWith({ installDir: '/test/path', npmTag: 'latest' })
    })

    it('run - help', async () => {
        vi.mocked(prompt).mockResolvedValue(false)
        vi.mocked(parseArguments).mockReturnValue({ _: [], help: true } as any)

        await run()

        // console.error(console.log.mock.calls)
        expect(console.log).toBeCalledTimes(1)
        expect(vi.mocked(console.log).mock.calls[0][0]).toContain('Usage: syngrisi [DIRECTORY] [OPTIONS]')
        expect(createSyngrisiProject).toBeCalledTimes(0)
    })
})

afterEach(() => {
    console.log = consoleLog
})
