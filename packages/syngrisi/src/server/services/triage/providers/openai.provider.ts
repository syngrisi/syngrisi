import { TriageProvider, TriageProviderConfig, TriageInput, TriageVerdictResult } from '../types';
import { SYSTEM_PROMPT, buildUserText, normalizeResult } from '../prompt';

// OpenAI-compatible /chat/completions. Covers OpenAI, Ollama, vLLM, LiteLLM, OpenRouter, etc.
export class OpenAIProvider implements TriageProvider {
    constructor(private cfg: TriageProviderConfig) {}

    async classify(input: TriageInput): Promise<TriageVerdictResult> {
        const model = this.cfg.model ?? 'gpt-4o';
        const baseUrl = (this.cfg.baseUrl ?? 'https://api.openai.com/v1').replace(/\/$/, '');
        const imageParts = [
            ['baseline', input.baselineB64],
            ['actual', input.actualB64],
            ['diff', input.diffB64],
        ]
            .filter(([, b64]) => !!b64)
            .map(([label, b64]) => ([
                { type: 'text', text: `${label}:` },
                { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
            ]))
            .flat();

        const body = {
            model,
            temperature: this.cfg.temperature ?? 0,
            max_tokens: this.cfg.maxTokens ?? 300,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: [{ type: 'text', text: buildUserText(input) }, ...imageParts] },
            ],
        };

        const resp = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.cfg.apiKey ? { Authorization: `Bearer ${this.cfg.apiKey}` } : {}),
            },
            body: JSON.stringify(body),
        });
        if (!resp.ok) {
            throw new Error(`OpenAI provider HTTP ${resp.status}: ${await resp.text()}`);
        }
        const data: any = await resp.json();
        const content = data?.choices?.[0]?.message?.content ?? '';
        return normalizeResult(content, model);
    }
}
