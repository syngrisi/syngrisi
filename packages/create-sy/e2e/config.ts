import { resolve } from 'node:path'

export const config = {
    // Timeouts (in milliseconds)
    containerStartTimeout: 60_000,
    npmInstallTimeout: 180_000, // 3 minutes for npm install
    serverStartTimeout: 60_000,
    testTimeout: 300_000, // 5 minutes per test

    // Paths
    createSyRoot: resolve(import.meta.dirname, '..'),
    e2eRoot: resolve(import.meta.dirname),

    // Container settings
    nodeVersions: ['18', '20', '22'] as const,

    // npm registry
    npmRegistry: process.env.NPM_REGISTRY || 'https://registry.npmjs.org',
} as const

export type NodeVersion = typeof config.nodeVersions[number]
