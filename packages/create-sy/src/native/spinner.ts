/**
 * Native terminal spinner - replacement for ora
 * Provides animated loading indicator for long-running operations
 */

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const FRAME_INTERVAL = 80 // ms

export interface Spinner {
    start(): Spinner
    stop(): void
}

export function createSpinner(text: string): Spinner {
    let frameIndex = 0
    let interval: NodeJS.Timeout | null = null

    return {
        start() {
            // If not a TTY, just print the text once and return
            if (!process.stdout.isTTY) {
                console.log(text)
                return this
            }

            // Hide cursor
            process.stdout.write('\x1b[?25l')

            interval = setInterval(() => {
                const frame = frames[frameIndex++ % frames.length]
                process.stdout.write(`\r${frame} ${text}`)
            }, FRAME_INTERVAL)

            return this
        },

        stop() {
            if (interval) {
                clearInterval(interval)
                interval = null
            }

            if (process.stdout.isTTY) {
                // Clear line and show cursor
                process.stdout.write('\r\x1b[K')
                process.stdout.write('\x1b[?25h')
            }
        },
    }
}

/**
 * ora-compatible factory function
 */
export function ora(text: string): Spinner {
    return createSpinner(text)
}
