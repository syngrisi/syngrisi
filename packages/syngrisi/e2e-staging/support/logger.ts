/**
 * Simple logger for staging tests
 */
export function createLogger(name: string) {
  const timestamp = () => new Date().toISOString().slice(11, 23);

  return {
    info: (msg: string) => console.log(`[${timestamp()}] [${name}] INFO: ${msg}`),
    warn: (msg: string) => console.warn(`[${timestamp()}] [${name}] WARN: ${msg}`),
    error: (msg: string) => console.error(`[${timestamp()}] [${name}] ERROR: ${msg}`),
    debug: (msg: string) => {
      if (process.env.DEBUG) {
        console.log(`[${timestamp()}] [${name}] DEBUG: ${msg}`);
      }
    },
  };
}
