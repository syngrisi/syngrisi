/**
 * Native ANSI color utilities - replacement for chalk
 * Supports NO_COLOR environment variable and non-TTY environments
 */

const isColorSupported = (): boolean => {
    // Respect NO_COLOR environment variable (https://no-color.org/)
    if (process.env.NO_COLOR !== undefined) return false
    // Check if stdout is a TTY
    if (!process.stdout.isTTY) return false
    // Check for dumb terminal
    if (process.env.TERM === 'dumb') return false
    return true
}

const wrap = (code: string, resetCode = '0') => {
    const enabled = isColorSupported()
    return (s: string): string => enabled ? `\x1b[${code}m${s}\x1b[${resetCode}m` : s
}

export const c = {
    // Standard colors
    red: wrap('31'),
    green: wrap('32'),
    yellow: wrap('33'),
    white: (s: string): string => s, // white is just default

    // Bright colors
    greenBright: wrap('92'),
    whiteBright: wrap('97'),

    // Formatting
    bold: wrap('1', '22'),
}

// Chainable version for chalk.white.bold() style calls
export const chalk = {
    red: (s: string) => c.red(s),
    green: (s: string) => c.green(s),
    yellow: (s: string) => c.yellow(s),
    greenBright: (s: string) => c.greenBright(s),
    whiteBright: (s: string) => c.whiteBright(s),
    bold: (s: string) => c.bold(s),
    white: {
        bold: (s: string) => c.bold(s),
        toString: () => '',
    },
}
