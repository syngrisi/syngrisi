#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SyngrisiClient } from './api';
import { createServer } from './server';

interface CliOptions {
    url?: string;
    apiKey?: string;
}

function parseArgs(argv: string[]): CliOptions {
    const opts: CliOptions = {};
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--url') {
            opts.url = argv[i + 1];
            i += 1;
        } else if (arg === '--api-key') {
            opts.apiKey = argv[i + 1];
            i += 1;
        }
    }
    return opts;
}

async function main(): Promise<void> {
    const cli = parseArgs(process.argv.slice(2));
    const url = cli.url || process.env.SYNGRISI_URL;
    const apiKey = cli.apiKey || process.env.SYNGRISI_API_KEY;

    if (!url) {
        // Note: never log the API key here or anywhere else.
        // eslint-disable-next-line no-console
        console.error('syngrisi-mcp: missing Syngrisi instance URL. Set SYNGRISI_URL or pass --url <url>.');
        process.exit(1);
    }

    const client = new SyngrisiClient({ url, apiKey });
    const server = createServer(client);
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(`syngrisi-mcp: fatal error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
});
