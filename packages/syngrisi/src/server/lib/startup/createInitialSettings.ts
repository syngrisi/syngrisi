import { appSettings } from "@settings";
import { AppSettings as AppSettingsModel } from '@models';
import log from "@logger";
import initialAppSettings from '../../../seeds/initialAppSettings.json';

const logOpts = {
    scope: 'on_start',
    msgType: 'SETUP',
};

// "Private AI" / headless provisioning: seed the AI Triage provider from an env JSON string
// (see `env_variable` on the `ai_triage_provider` seed). Env wins over the stored value on
// startup — the same env-over-admin precedence used by SYNGRISI_AI_TRIAGE_ENABLED.
// Example: SYNGRISI_AI_TRIAGE_PROVIDER_JSON='{"type":"openai","baseUrl":"http://ollama:11434/v1","model":"gemma4:12b"}'
async function seedTriageProviderFromEnv(): Promise<void> {
    const raw = process.env.SYNGRISI_AI_TRIAGE_PROVIDER_JSON;
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('expected a JSON object');
        }
        await appSettings.set('ai_triage_provider', parsed);
        log.info('AI Triage provider seeded from SYNGRISI_AI_TRIAGE_PROVIDER_JSON', logOpts);
    } catch (e) {
        log.error(`invalid SYNGRISI_AI_TRIAGE_PROVIDER_JSON, ignored: ${e}`, logOpts);
    }
}

export async function createInitialSettings(): Promise<void> {
    const settings = appSettings;
    if (await settings.count() < 1) {
        await settings.loadInitialFromFile();
    } else {
        for (const seed of initialAppSettings) {
            await AppSettingsModel.updateOne(
                { name: seed.name },
                { $setOnInsert: seed },
                { upsert: true }
            );
        }
        await settings.init();
    }
    await seedTriageProviderFromEnv();
}
