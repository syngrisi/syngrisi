import { vi, expect, describe, it, beforeEach } from 'vitest'
import { readPackageUp } from 'read-pkg-up'
import { createSyngrisiProject } from '../src/createSyngrisiProject'
import { printAndExit, runProgram } from '../src/utils'
// @ts-ignore
import fs from 'node:fs/promises'

vi.mock('node:fs/promises', () => ({
    default: {
        access: vi.fn().mockRejectedValue(new Error('not existing')),
        mkdir: vi.fn(),
        writeFile: vi.fn()
    }
}))
vi.mock('../src/utils', async () => {
    const actual = await vi.importActual('../src/utils')
    return {
        // @ts-ignore
        ...actual,
        runProgram: vi.fn(),
        printAndExit: vi.fn(),
        getSyngrisiVersion: vi.fn().mockReturnValue('1.2.3')
    }
})

vi.mock('read-pkg-up')

beforeEach(async () => {
    vi.mocked(runProgram).mockClear()
    vi.mocked(readPackageUp).mockClear()
    vi.mocked(fs.mkdir).mockClear()
})

describe('createSyngrisiProject', () => {
    it('happy path - package.json doesn\'t exist', async () => {
        vi.mocked(readPackageUp).mockResolvedValue(undefined)

        await createSyngrisiProject({ installDir: '.', npmTag: '' })
        expect(fs.mkdir).toBeCalledTimes(1)
        expect(fs.mkdir).toBeCalledWith('.', { 'recursive': true })
        expect(readPackageUp).toBeCalledTimes(1)
        expect(printAndExit).toBeCalledTimes(0)
        expect(runProgram).toBeCalledWith('npm', ['install', '@syngrisi/syngrisi'], { cwd: '.', stdio: 'ignore' })
    })

    it('happy path - package.json exist', async () => {
        vi.mocked(readPackageUp).mockResolvedValue({
            path: '/foo/bar/package.json',
            packageJson: { name: 'my-new-project' }
        })

        await createSyngrisiProject({ installDir: '.', npmTag: '' })
        expect(fs.mkdir).toBeCalledTimes(0)
        expect(readPackageUp).toBeCalledTimes(1)
        expect(printAndExit).toBeCalledTimes(0)
        expect(runProgram).toBeCalledWith('npm', ['install', '@syngrisi/syngrisi'], { cwd: '.', stdio: 'ignore' })
    })

    it('happy path - not empty npmTag', async () => {
        vi.mocked(readPackageUp).mockResolvedValue(undefined)

        await createSyngrisiProject({ installDir: '.', npmTag: 'latest' })
        expect(fs.mkdir).toBeCalledTimes(1)
        expect(fs.mkdir).toBeCalledWith('.', { 'recursive': true })
        expect(readPackageUp).toBeCalledTimes(1)
        expect(printAndExit).toBeCalledTimes(0)
        expect(runProgram).toBeCalledWith('npm', ['install', '@syngrisi/syngrisi@latest'], { cwd: '.', stdio: 'ignore' })
    })

    it('empty install dir option', async () => {
        vi.mocked(readPackageUp).mockResolvedValue({
            path: '/foo/bar/package.json',
            packageJson: { name: 'my-new-project' }
        })

        await createSyngrisiProject({ installDir: '', npmTag: '' })
        expect(printAndExit).toBeCalledTimes(1)
        expect(printAndExit).toBeCalledWith('installDir is empty')
        expect(runProgram).toBeCalledTimes(0)
    })
})
