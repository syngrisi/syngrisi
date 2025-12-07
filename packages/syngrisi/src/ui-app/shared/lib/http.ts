export interface HttpOptions {
    headers?: Record<string, string>;
    timeout?: number;
    retry?: number;
    credentials?: RequestCredentials;
    throwHttpErrors?: boolean;
}

export interface HttpResponse<T = unknown> extends Response {
    data?: T;
}

class HttpError extends Error {
    constructor(
        public response: Response,
        public status: number,
        message: string,
        public caller?: string
    ) {
        super(caller ? `[${caller}] ${message}` : message);
        this.name = 'HttpError';
    }
}

const DEFAULT_TIMEOUT = 30000;

async function fetchWithTimeout(
    url: string,
    options: RequestInit & { timeout?: number }
): Promise<Response> {
    const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function fetchWithRetry(
    url: string,
    options: RequestInit & { timeout?: number; retry?: number }
): Promise<Response> {
    const { retry = 0, ...fetchOptions } = options;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retry; attempt++) {
        try {
            return await fetchWithTimeout(url, fetchOptions);
        } catch (error) {
            lastError = error as Error;
            if (attempt < retry) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }
    }

    throw lastError;
}

async function request<T = unknown>(
    url: string,
    options: RequestInit & HttpOptions = {},
    caller?: string
): Promise<HttpResponse<T>> {
    const {
        headers = {},
        timeout,
        retry,
        credentials,
        throwHttpErrors = true,
        ...rest
    } = options;

    const response = await fetchWithRetry(url, {
        ...rest,
        headers,
        credentials,
        timeout,
        retry,
    }) as HttpResponse<T>;

    if (throwHttpErrors && !response.ok) {
        throw new HttpError(
            response,
            response.status,
            `Request failed with status ${response.status}`,
            caller
        );
    }

    return response;
}

export const http = {
    async get<T = unknown>(url: string, options?: HttpOptions, caller?: string): Promise<HttpResponse<T>> {
        return request<T>(url, { ...options, method: 'GET' }, caller);
    },

    async post<T = unknown>(
        url: string,
        data?: unknown,
        options?: HttpOptions,
        caller?: string
    ): Promise<HttpResponse<T>> {
        const headers: Record<string, string> = { ...options?.headers };
        let body: string | undefined;

        if (data !== undefined) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        return request<T>(url, { ...options, method: 'POST', headers, body }, caller);
    },

    async put<T = unknown>(
        url: string,
        data?: unknown,
        options?: HttpOptions,
        caller?: string
    ): Promise<HttpResponse<T>> {
        const headers: Record<string, string> = { ...options?.headers };
        let body: string | undefined;

        if (data !== undefined) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        return request<T>(url, { ...options, method: 'PUT', headers, body }, caller);
    },

    async patch<T = unknown>(
        url: string,
        data?: unknown,
        options?: HttpOptions,
        caller?: string
    ): Promise<HttpResponse<T>> {
        const headers: Record<string, string> = { ...options?.headers };
        let body: string | undefined;

        if (data !== undefined) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        return request<T>(url, { ...options, method: 'PATCH', headers, body }, caller);
    },

    async delete<T = unknown>(url: string, options?: HttpOptions, caller?: string): Promise<HttpResponse<T>> {
        return request<T>(url, { ...options, method: 'DELETE' }, caller);
    },
};

export default http;
