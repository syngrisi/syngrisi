import { TriageProvider, TriageProviderConfig, TriageInput, TriageVerdictResult } from '../types';
import { SYSTEM_PROMPT, buildUserText, normalizeResult } from '../prompt';

// Native Google Gemini generateContent with inlineData image parts.
export class GeminiProvider implements TriageProvider {
    constructor(private cfg: TriageProviderConfig) {}

    async classify(input: TriageInput): Promise<TriageVerdictResult> {
        const model = this.cfg.model ?? 'gemini-2.0-flash';
        const baseUrl = (this.cfg.baseUrl ?? 'https://generativelanguage.googleapis.com').replace(/\/$/, '');
        const imageParts = [input.baselineB64, input.actualB64, input.diffB64]
            .filter((b64): b64 is string => !!b64)
            .map((b64) => ({ inlineData: { mimeType: 'image/png', data: b64 } }));

        const body = {
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts: [{ text: buildUserText(input) }, ...imageParts] }],
            generationConfig: {
                temperature: this.cfg.temperature ?? 0,
                maxOutputTokens: this.cfg.maxTokens ?? 300,
                responseMimeType: 'application/json',
            },
        };

        const url = `${baseUrl}/v1beta/models/${model}:generateContent?key=${this.cfg.apiKey ?? ''}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!resp.ok) {
            throw new Error(`Gemini provider HTTP ${resp.status}: ${await resp.text()}`);
        }
        const data: any = await resp.json();
        const content = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') ?? '';
        return normalizeResult(content, model);
    }
}
