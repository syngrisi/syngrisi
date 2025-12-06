/**
 * Simple ANSI color helpers - native replacement for chalk package
 * Provides basic terminal color formatting
 */

// ANSI escape codes
const RESET = '\x1b[0m';

/**
 * Color functions for terminal output
 */
export const colors = {
    // Standard colors
    blue: (s: string) => `\x1b[34m${s}${RESET}`,
    green: (s: string) => `\x1b[32m${s}${RESET}`,
    red: (s: string) => `\x1b[31m${s}${RESET}`,
    yellow: (s: string) => `\x1b[33m${s}${RESET}`,
    magenta: (s: string) => `\x1b[35m${s}${RESET}`,
    cyan: (s: string) => `\x1b[36m${s}${RESET}`,

    // Bright colors
    gray: (s: string) => `\x1b[90m${s}${RESET}`,
    whiteBright: (s: string) => `\x1b[97m${s}${RESET}`,

    // Reset code for manual use
    reset: RESET,
};

export default colors;
