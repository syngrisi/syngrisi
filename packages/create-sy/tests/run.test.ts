import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest'
import { run } from '../src'
import { createSyngrisiProject } from '../src/createSyngrisiProject'
import { checkMongoDB, checkNodeVersion, parseArguments, prompt } from '../src/utils'
import * as path from 'node:path'
import chalk from 'chalk'

const WRONG_NODEVERSION = '6.9.9'

const NODE_WARN = 'of Node.js is not supported. Please use Node.js version'

vi.mock('../src/utils', async () => {
    const actual = await vi.importActual('../src/utils')
    return {
        // @ts-ignore
        ...actual,
        parseArguments: vi.fn().mockReturnValue({ _: [], }),
        getArgs: vi.fn(),
        prompt: vi.fn(),
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
        vi.mocked(checkMongoDB).mockReturnValue({ version: '7.0.1', supported: true })
        vi.mocked(checkNodeVersion).mockReturnValue({ version: '14.0.20', supported: true })

        await run()

        expect(console.log).toBeCalledTimes(0)
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
        expect(checkMongoDB).toBeCalledTimes(0)
        expect(checkNodeVersion).toBeCalledTimes(0)
        expect(createSyngrisiProject).toBeCalledTimes(0)
    })

    it('run - without args, prompt: true, requirements: {mongo: `wrong version`, node: `wrong_version`}' , async () => {
        vi.mocked(prompt).mockResolvedValue(true)
        vi.mocked(checkMongoDB).mockReturnValue({ version: WRONG_NODEVERSION, supported: false })
        vi.mocked(checkNodeVersion).mockReturnValue({ version: '12.0.20', supported: false })

        await run()

        expect(vi.mocked(console.log).mock.calls[0][0]).toContain('Wrong MongoDB version: \'6.9.9\' Please install the proper MongoDB version: \'>=7.0\'')
        expect(vi.mocked(console.log).mock.calls[1][0]).toContain(NODE_WARN)

        expect(console.log).toBeCalledTimes(2)
        expect(checkMongoDB).toBeCalledTimes(1)
        expect(checkNodeVersion).toBeCalledTimes(1)
        expect(createSyngrisiProject).toBeCalledTimes(0)
    })

    it('run - without args, prompt: true, requirements: {mongo: `not_installed`}' , async () => {
        vi.mocked(prompt).mockResolvedValue(true)
        vi.mocked(checkMongoDB).mockReturnValue({ version: 'unknown', supported: false })
        vi.mocked(checkNodeVersion).mockReturnValue({ version: '21.0.20', supported: true })

        await run()

        expect(vi.mocked(console.log).mock.calls[0][0]).toContain('Please install MongoDB if you want to run Syngrisi in the native mode')

        expect(console.log).toBeCalledTimes(1)
        expect(checkMongoDB).toBeCalledTimes(1)
        expect(createSyngrisiProject).toBeCalledTimes(1)
    })

    it('run - with args, { _: [ \'/test/path\' ], npmTag: \'latest\', force: true, yes: true }', async () => {
        vi.mocked(parseArguments).mockReturnValue({ _: ['/test/path'], npmTag: 'latest', force: true, yes: true } as any)
        vi.mocked(prompt).mockResolvedValue(true)
        vi.mocked(checkMongoDB).mockReturnValue({ version: '7.0.1', supported: true })
        vi.mocked(checkNodeVersion).mockReturnValue({ version: '14.0.20', supported: true })

        await run()
        // console.error(console.log.mock.calls)

        expect(console.log).toBeCalledTimes(0)
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
