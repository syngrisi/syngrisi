import { TriageProvider, TriageProviderConfig, TriageInput, TriageVerdictResult } from '../types';

// Deterministic provider for e2e/unit tests — no network. Verdict comes from config.
export class FakeProvider implements TriageProvider {
    constructor(private cfg: TriageProviderConfig) {}

    async classify(_input: TriageInput): Promise<TriageVerdictResult> {
        return {
            verdict: this.cfg.fakeVerdict ?? 'uncertain',
            confidence: typeof this.cfg.fakeConfidence === 'number' ? this.cfg.fakeConfidence : 5,
            reason: this.cfg.fakeReason ?? 'fake triage verdict',
            model: this.cfg.model ?? 'fake',
        };
    }
}
