import { TriageProvider, TriageProviderConfig, TriageInput, TriageVerdictResult } from '../types';
import { buildSystemPrompt, buildUserText, normalizeResult, parseImageData } from '../prompt';

// Native Anthropic Messages API with image blocks.
export class AnthropicProvider implements TriageProvider {
    constructor(private cfg: TriageProviderConfig) {}

    async classify(input: TriageInput): Promise<TriageVerdictResult> {
        const model = this.cfg.model ?? 'claude-sonnet-4-6';
        const baseUrl = (this.cfg.baseUrl ?? 'https://api.anthropic.com').replace(/\/$/, '');
        const imageBlocks = [
            ['baseline', input.baselineB64],
            ['actual', input.actualB64],
            ['diff', input.diffB64],
        ]
            .filter(([, b64]) => !!b64)
            .map(([label, b64]) => ([
                { type: 'text', text: `${label}:` },
                { type: 'image', source: { type: 'base64', media_type: 'image/png', data: b64 } },
            ]))
            .flat();

        const exampleBlocks = (input.examples ?? []).flatMap((ex) => {
            const { mediaType, data } = parseImageData(ex.image);
            return [
                { type: 'text', text: `Example — verdict "${ex.verdict}"${ex.note ? ` (${ex.note})` : ''}:` },
                { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
            ];
        });

        const body = {
            model,
            max_tokens: this.cfg.maxTokens ?? 4096, // Anthropic requires max_tokens
            temperature: this.cfg.temperature ?? 0,
            system: `${input.systemPrompt || buildSystemPrompt(input.verdicts)}\nRespond with JSON only.`,
            messages: [
                { role: 'user', content: [...exampleBlocks, { type: 'text', text: buildUserText(input) }, ...imageBlocks] },
            ],
        };

        const resp = await fetch(`${baseUrl}/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.cfg.apiKey ?? '',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.cfg.timeoutMs ?? 120000),
        });
        if (!resp.ok) {
            // Do not reflect the upstream response body — cfg.baseUrl is user-controlled
            // and this error is surfaced back to the caller (SSRF info-disclosure risk).
            throw new Error(`Anthropic provider HTTP ${resp.status}`);
        }
        const data: any = await resp.json();
        const content = Array.isArray(data?.content)
            ? data.content.map((c: any) => c.text || '').join('')
            : '';
        return normalizeResult(content, model, input.verdicts);
    }

    async ping(): Promise<{ model: string }> {
        const model = this.cfg.model ?? 'claude-sonnet-4-6';
        const baseUrl = (this.cfg.baseUrl ?? 'https://api.anthropic.com').replace(/\/$/, '');
        // Minimal 1-token message — verifies key + model without a full classification.
        const resp = await fetch(`${baseUrl}/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.cfg.apiKey ?? '',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({ model, max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] }),
            signal: AbortSignal.timeout(15000),
        });
        // Do not reflect the upstream response body — cfg.baseUrl is user-controlled
        // and this error is surfaced back to the caller (SSRF info-disclosure risk).
        if (!resp.ok) throw new Error(`Anthropic provider HTTP ${resp.status}`);
        return { model };
    }
}
