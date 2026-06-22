import { TriageProvider, TriageProviderConfig, TriageInput, TriageVerdictResult } from '../types';
import { SYSTEM_PROMPT, buildUserText, normalizeResult } from '../prompt';

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
            max_tokens: this.cfg.maxTokens ?? 300,
            temperature: this.cfg.temperature ?? 0,
            system: `${SYSTEM_PROMPT}\nRespond with JSON only.`,
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
        });
        if (!resp.ok) {
            throw new Error(`Anthropic provider HTTP ${resp.status}: ${await resp.text()}`);
        }
        const data: any = await resp.json();
        const content = Array.isArray(data?.content)
            ? data.content.map((c: any) => c.text || '').join('')
            : '';
        return normalizeResult(content, model);
    }
}
