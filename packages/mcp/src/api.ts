/**
 * Thin fetch-based client for the Syngrisi REST API.
 *
 * Deliberately small and dependency-free (Node 22 has a global `fetch`): the MCP
 * server only needs a handful of read endpoints plus "accept check" and the static
 * snapshot image route, so pulling in `@syngrisi/core-api` (built for SDK authors
 * pushing checks) would be the wrong tool for the job.
 */

export interface SyngrisiClientConfig {
    /** Base URL of the Syngrisi instance, e.g. "http://localhost:3000" */
    url: string;
    /** Optional API key. Instances started with SYNGRISI_AUTH=false need none. */
    apiKey?: string;
}

export interface PaginatedResult<T> {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    timestamp: number | string;
}

export interface RunDoc {
    id: string;
    _id: string;
    name: string;
    app: string;
    ident: string;
    createdDate: string;
    updatedDate?: string;
}

export interface TestDoc {
    id: string;
    _id: string;
    name: string;
    status: string;
    branch?: string;
    browserName?: string;
    browserVersion?: string;
    viewport?: string;
    os?: string;
    run?: string;
    checks?: string[];
}

export interface SnapshotDoc {
    id: string;
    _id: string;
    name: string;
    filename?: string;
    path?: string;
    imghash?: string;
}

export interface CheckDoc {
    id: string;
    _id: string;
    name: string;
    test: string;
    suite: string;
    app: string;
    run: string;
    branch?: string;
    status: string[];
    browserName?: string;
    browserVersion?: string;
    browserFullVersion?: string;
    viewport?: string;
    os?: string;
    result?: string;
    failReasons?: string[];
    markedAs?: string;
    createdDate?: string;
    updatedDate?: string;
    baselineId?: string | SnapshotDoc | null;
    actualSnapshotId?: string | SnapshotDoc | null;
    diffId?: string | SnapshotDoc | null;
}

export interface AppDoc {
    id: string;
    _id: string;
    name: string;
}

export interface ListOptions {
    limit?: number;
    sortBy?: string;
    populate?: string;
}

export class SyngrisiApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'SyngrisiApiError';
    }
}

/** Resolve a snapshot id field that may or may not have been populated into a document. */
export function snapshotIdOf(field: string | SnapshotDoc | null | undefined): string | undefined {
    if (!field) return undefined;
    return typeof field === 'string' ? field : field.id || field._id;
}

export class SyngrisiClient {
    private readonly baseUrl: string;

    private readonly apiKey?: string;

    constructor(cfg: SyngrisiClientConfig) {
        if (!cfg.url) throw new Error('SyngrisiClient: "url" is required');
        this.baseUrl = cfg.url.endsWith('/') ? cfg.url : `${cfg.url}/`;
        this.apiKey = cfg.apiKey;
    }

    private authHeaders(): Record<string, string> {
        return this.apiKey ? { apikey: this.apiKey } : {};
    }

    private async requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            ...init,
            headers: {
                ...this.authHeaders(),
                ...(init.body ? { 'content-type': 'application/json' } : {}),
                ...(init.headers as Record<string, string> | undefined),
            },
        });
        const text = await res.text();
        let body: unknown;
        try {
            body = text ? JSON.parse(text) : {};
        } catch {
            body = text;
        }
        if (!res.ok) {
            const message = typeof body === 'object' ? JSON.stringify(body) : String(body);
            throw new SyngrisiApiError(`Syngrisi API request failed (${res.status} ${res.statusText}): ${message}`, res.status);
        }
        return body as T;
    }

    private buildQuery(filter: Record<string, unknown>, options: ListOptions = {}): string {
        const params = new URLSearchParams();
        params.set('filter', JSON.stringify(filter));
        params.set('limit', String(options.limit ?? 10));
        if (options.sortBy) params.set('sortBy', options.sortBy);
        if (options.populate) params.set('populate', options.populate);
        return params.toString();
    }

    async listRuns(filter: Record<string, unknown> = {}, options: ListOptions = {}): Promise<PaginatedResult<RunDoc>> {
        return this.requestJson<PaginatedResult<RunDoc>>(`v1/runs?${this.buildQuery(filter, { sortBy: 'createdDate:desc', ...options })}`);
    }

    async listApps(filter: Record<string, unknown> = {}, options: ListOptions = {}): Promise<PaginatedResult<AppDoc>> {
        return this.requestJson<PaginatedResult<AppDoc>>(`v1/app?${this.buildQuery(filter, options)}`);
    }

    async listTests(filter: Record<string, unknown> = {}, options: ListOptions = {}): Promise<PaginatedResult<TestDoc>> {
        return this.requestJson<PaginatedResult<TestDoc>>(`v1/tests?${this.buildQuery(filter, options)}`);
    }

    async listChecks(filter: Record<string, unknown> = {}, options: ListOptions = {}): Promise<PaginatedResult<CheckDoc>> {
        return this.requestJson<PaginatedResult<CheckDoc>>(`v1/checks?${this.buildQuery(filter, options)}`);
    }

    async getCheck(checkId: string, populate = 'baselineId,actualSnapshotId,diffId'): Promise<CheckDoc | undefined> {
        const result = await this.listChecks({ _id: checkId }, { limit: 1, populate });
        return result.results[0];
    }

    async acceptCheck(checkId: string, baselineId: string): Promise<CheckDoc> {
        return this.requestJson<CheckDoc>(`v1/checks/${checkId}/accept`, {
            method: 'PUT',
            body: JSON.stringify({ baselineId }),
        });
    }

    /** Fetch a snapshot image by filename from the static /snapshoots route. */
    async fetchImage(filename: string): Promise<Buffer> {
        const res = await fetch(`${this.baseUrl}snapshoots/${filename}`, { headers: this.authHeaders() });
        if (!res.ok) {
            throw new SyngrisiApiError(`Failed to fetch image '${filename}' (${res.status} ${res.statusText})`, res.status);
        }
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}
