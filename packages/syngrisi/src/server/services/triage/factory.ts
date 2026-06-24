import { TriageProvider, TriageProviderConfig } from './types';
import { OpenAIProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { FakeProvider } from './providers/fake.provider';

export function createProvider(cfg: TriageProviderConfig): TriageProvider {
    switch (cfg.type) {
        case 'anthropic':
            return new AnthropicProvider(cfg);
        case 'gemini':
            return new GeminiProvider(cfg);
        case 'fake':
            return new FakeProvider(cfg);
        case 'openai':
        default:
            // openai-compatible covers OpenAI and self-hosted (Ollama/vLLM/...) via baseUrl
            return new OpenAIProvider(cfg);
    }
}
