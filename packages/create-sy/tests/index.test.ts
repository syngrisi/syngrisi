// import fs from 'node:fs/promises'
// import semver from 'semver'
// import * as utils from '../src/utils.js'

// import hasYarn from 'has-yarn'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { vi, test, expect, beforeEach, afterEach } from 'vitest'
// import { Command } from 'commander'
// import { readPackageUp } from 'read-pkg-up'

import { run, } from '../src'
// import { checkNodeVersion } from '../src/utils.js'
// import { runProgram } from '../src/utils'

// vi.mock('node:fs/promises', () => ({
//     default: {
//         access: vi.fn().mockRejectedValue(new Error('not existing')),
//         mkdir: vi.fn(),
//         writeFile: vi.fn()
//     }
// }))
// vi.mock('has-yarn')
// vi.mock('read-pkg-up')
// vi.mock('commander')
// vi.mock('semver', () => ({
//     default: {
//         satisfies: vi.fn().mockReturnValue(true)
//     }
// }))
const actual = await vi.importActual('../src/utils.js')

vi.mock('../src/utils.js', () => ({
    ...actual,
    semver: vi.fn().mockReturnValue('11.12'),
    // runProgram: vi.fn(),
    // colorItBold: vi.fn((log) => log),
    // colorIt: vi.fn((log) => log),
    // getPackageVersion: vi.fn().mockReturnValue('0.1.1'),
    // shouldUseYarn: vi.fn().mockReturnValue(true)
}))

const consoleLog = console.log.bind(console)
beforeEach(() => {
    console.log = vi.fn()
})

// test('run', async () => {
//     const op = vi.fn().mockResolvedValue({})
//     await run(op)
//
//     expect(op).toBeCalledTimes(1)
//     expect(op).toBeCalledWith('foobar')
//     expect(new Command().arguments).toBeCalledWith('[project-path]')
//     expect(console.log).toBeCalledTimes(1)
//     expect(vi.mocked(console.log).mock.calls[0][0]).toContain('oooooooooooo')
//     expect(vi.mocked(console.log).mock.calls[0][1]).toContain('Next-gen browser and mobile automation')
// })

test('does not run if Node.js version is too low', async () => {
    await run()
    // vi.mocked(utils.).mockReturnValue(false)
    // const op = vi.fn().mockResolvedValue({})
    // await run(op)
    // expect(op).toBeCalledTimes(0)
})

// test('createWebdriverIO with Yarn', async () => {
//     vi.mocked(hasYarn).mockResolvedValue(true)
//     await createWebdriverIO({ npmTag: 'next', verbose: true, yes: true } as any)
//     expect(readPackageUp).toBeCalledTimes(1)
//     expect(fs.writeFile).toBeCalledWith(
//         expect.any(String),
//         JSON.stringify({
//             name: 'my-new-project',
//             type: 'module'
//         }, null, 2)
//     )
//     expect(runProgram).toBeCalledWith(
//         'yarnpkg',
//         ['add', '--exact', '--cwd', expect.any(String), '@wdio/cli@next'],
//         expect.any(Object)
//     )
//     expect(runProgram).toBeCalledWith(
//         'npx',
//         ['wdio', 'config', '--yarn', '--yes'],
//         expect.any(Object)
//     )
//     expect(fs.mkdir).toBeCalledTimes(1)
// })
//
// test('createWebdriverIO with NPM', async () => {
//     await createWebdriverIO({ useYarn: false, npmTag: 'next', verbose: true, yes: true } as any)
//     expect(runProgram).toBeCalledWith(
//         'npm',
//         ['install', '--save', '--loglevel', 'trace', '@wdio/cli@next'],
//         expect.any(Object)
//     )
//     expect(runProgram).toBeCalledWith(
//         'npx',
//         ['wdio', 'config', '--yes'],
//         expect.any(Object)
//     )
//     expect(fs.mkdir).toBeCalledTimes(1)
// })

afterEach(() => {
    // vi.mocked(fs.mkdir).mockClear()
    // vi.mocked(runProgram).mockClear()
    vi.clearAllMocks()
    console.log = consoleLog
})
