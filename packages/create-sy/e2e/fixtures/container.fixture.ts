import {
    isContainerCliAvailable,
    containerRunCommand,
    getNodeImage,
    type NodeVersion,
    type ExecResult,
} from '../utils/container-cli.js'
import { config } from '../config.js'

export interface ContainerTestContext {
    isAvailable: boolean
    runInNode: (
        version: NodeVersion,
        commands: string[],
        options?: { env?: Record<string, string>; timeout?: number }
    ) => ExecResult
}

/**
 * Creates a container test context for running commands in Node containers
 */
export function createContainerContext(): ContainerTestContext {
    const isAvailable = isContainerCliAvailable()

    const runInNode = (
        version: NodeVersion,
        commands: string[],
        options: { env?: Record<string, string>; timeout?: number } = {}
    ): ExecResult => {
        if (!isAvailable) {
            return {
                stdout: '',
                stderr: 'Apple Container CLI not available',
                exitCode: 1,
            }
        }

        const image = getNodeImage(version)
        const timeout = options.timeout || config.npmInstallTimeout

        return containerRunCommand(image, commands, {
            env: {
                ...options.env,
                NPM_CONFIG_REGISTRY: config.npmRegistry,
            },
            timeout,
        })
    }

    return {
        isAvailable,
        runInNode,
    }
}

// Singleton context for tests
let containerContext: ContainerTestContext | null = null

export function getContainerContext(): ContainerTestContext {
    if (!containerContext) {
        containerContext = createContainerContext()
    }
    return containerContext
}
