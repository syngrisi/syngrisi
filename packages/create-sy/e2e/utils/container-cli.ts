import { execSync, spawn, ChildProcess } from 'node:child_process'

export interface ContainerRunOptions {
    name: string
    image: string
    env?: Record<string, string>
    volumes?: string[]
    workdir?: string
    detached?: boolean
    rm?: boolean
    command?: string[]
}

export interface ExecResult {
    stdout: string
    stderr: string
    exitCode: number
}

/**
 * Check if Apple Container CLI is available
 */
export function isContainerCliAvailable(): boolean {
    try {
        execSync('container --version', { stdio: 'ignore' })
        return true
    } catch {
        return false
    }
}

/**
 * Run a container with specified options
 */
export function containerRun(options: ContainerRunOptions): string {
    const args: string[] = ['run']

    if (options.detached) args.push('-d')
    if (options.rm) args.push('--rm')
    if (options.name) args.push('--name', options.name)
    if (options.workdir) args.push('-w', options.workdir)

    if (options.env) {
        Object.entries(options.env).forEach(([k, v]) => {
            args.push('-e', `${k}=${v}`)
        })
    }

    options.volumes?.forEach(v => args.push('-v', v))

    args.push(options.image)

    if (options.command) {
        args.push(...options.command)
    }

    return execSync(`container ${args.join(' ')}`, { encoding: 'utf-8' }).trim()
}

/**
 * Execute a command in a running container
 */
export function containerExec(
    containerName: string,
    command: string[],
    options: { timeout?: number } = {}
): ExecResult {
    const timeout = options.timeout || 120_000 // 2 minutes default

    try {
        const shellCommand = command.join(' ')
        const stdout = execSync(
            `container exec ${containerName} sh -c '${shellCommand}'`,
            {
                encoding: 'utf-8',
                timeout,
                maxBuffer: 10 * 1024 * 1024, // 10MB
            }
        )
        return { stdout, stderr: '', exitCode: 0 }
    } catch (error: any) {
        return {
            stdout: error.stdout || '',
            stderr: error.stderr || error.message,
            exitCode: error.status || 1,
        }
    }
}

/**
 * Run a command in a new container and return the result
 */
export function containerRunCommand(
    image: string,
    command: string[],
    options: {
        env?: Record<string, string>
        timeout?: number
    } = {}
): ExecResult {
    const timeout = options.timeout || 180_000 // 3 minutes default

    const args: string[] = ['run', '--rm']

    if (options.env) {
        Object.entries(options.env).forEach(([k, v]) => {
            args.push('-e', `${k}=${v}`)
        })
    }

    args.push(image)
    const shellCommand = command.join(' && ')

    try {
        const stdout = execSync(`container ${args.join(' ')} sh -c '${shellCommand}'`, {
            encoding: 'utf-8',
            timeout,
            maxBuffer: 10 * 1024 * 1024,
        })
        return { stdout, stderr: '', exitCode: 0 }
    } catch (error: any) {
        return {
            stdout: error.stdout || '',
            stderr: error.stderr || error.message,
            exitCode: error.status || 1,
        }
    }
}

/**
 * Delete a container
 */
export function containerDelete(name: string, force = true): void {
    try {
        execSync(`container delete ${force ? '-f' : ''} ${name}`, { stdio: 'ignore' })
    } catch {
        // Ignore errors - container may not exist
    }
}

/**
 * Stop a container
 */
export function containerStop(name: string): void {
    try {
        execSync(`container stop ${name}`, { stdio: 'ignore' })
    } catch {
        // Ignore errors
    }
}

/**
 * Get container logs
 */
export function containerLogs(name: string): string {
    try {
        return execSync(`container logs ${name}`, { encoding: 'utf-8' })
    } catch {
        return ''
    }
}

/**
 * List running containers
 */
export function containerList(): string[] {
    try {
        const output = execSync('container list -q', { encoding: 'utf-8' })
        return output.split('\n').filter(Boolean)
    } catch {
        return []
    }
}

export type NodeVersion = '18' | '20' | '22'

/**
 * Get image name for a Node.js version
 */
export function getNodeImage(version: NodeVersion): string {
    return `create-sy-node${version}`
}
