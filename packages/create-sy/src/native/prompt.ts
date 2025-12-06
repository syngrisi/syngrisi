/**
 * Native readline-based prompt - replacement for inquirer
 * Handles confirm prompts with proper SIGINT handling
 */

import * as readline from 'node:readline'

export interface PromptOptions {
    type: 'confirm'
    name: string
    message: string
    default?: boolean | string
}

/**
 * Ask a yes/no confirmation question
 */
export async function confirm(message: string, defaultValue = true): Promise<boolean> {
    // Non-interactive mode: return default
    if (!process.stdin.isTTY) {
        return defaultValue
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const hint = defaultValue ? '(Y/n)' : '(y/N)'

    return new Promise<boolean>((resolve) => {
        // Handle Ctrl+C
        rl.on('SIGINT', () => {
            rl.close()
            console.log('\n')
            process.exit(0)
        })

        // Handle close event (e.g., piped input ends)
        rl.on('close', () => {
            resolve(defaultValue)
        })

        rl.question(`${message} ${hint} `, (answer) => {
            rl.close()

            const input = answer.trim().toLowerCase()

            if (input === '') {
                resolve(defaultValue)
            } else {
                resolve(input === 'y' || input === 'yes')
            }
        })
    })
}

/**
 * inquirer-compatible prompt function
 * Supports only 'confirm' type for now
 */
export async function prompt<T extends Record<string, boolean>>(
    questions: PromptOptions[]
): Promise<T> {
    const result: Record<string, boolean> = {}

    for (const q of questions) {
        if (q.type === 'confirm') {
            const defaultVal = q.default === 'y' || q.default === true
            result[q.name] = await confirm(q.message, defaultVal)
        }
    }

    return result as T
}

export default { prompt, confirm }
