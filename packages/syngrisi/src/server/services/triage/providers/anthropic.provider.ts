import { TriageProvider, TriageProviderConfig, TriageInput, TriageVerdictResult } from '../types';
import { buildSystemPrompt, buildUserText, normalizeResult } from '../prompt';

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

        const body = {
            model,
            max_tokens: this.cfg.maxTokens ?? 4096, // Anthropic requires max_tokens
            temperature: this.cfg.temperature ?? 0,
            system: `${buildSystemPrompt(input.verdicts)}\nRespond with JSON only.`,
            messages: [
                { role: 'user', content: [{ type: 'text', text: buildUserText(input) }, ...imageBlocks] },
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
            throw new Error(`Anthropic provider HTTP ${resp.status}: ${await resp.text()}`);
        }
        const data: any = await resp.json();
        const content = Array.isArray(data?.content)
            ? data.content.map((c: any) => c.text || '').join('')
            : '';
        return normalizeResult(content, model, input.verdicts);
    }
}
