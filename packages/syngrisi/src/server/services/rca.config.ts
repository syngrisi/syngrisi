import { appSettings } from '@settings';

// RCA (Root Cause Analysis) global on/off.
// The SYNGRISI_RCA environment variable, when explicitly set, wins over the
// persisted `rca_enabled` admin setting (same env-over-admin precedence as
// AI Triage / SYNGRISI_AI_TRIAGE_ENABLED). Default (no env, no setting) is OFF.

// True when SYNGRISI_RCA is explicitly provided ('true' or 'false') — the admin
// toggle must be locked in that case.
export function isRcaEnvControlled(): boolean {
    return process.env.SYNGRISI_RCA === 'true' || process.env.SYNGRISI_RCA === 'false';
}

export async function isRcaEnabled(): Promise<boolean> {
    if (process.env.SYNGRISI_RCA === 'true') return true;
    if (process.env.SYNGRISI_RCA === 'false') return false;
    const setting = await appSettings.get('rca_enabled');
    return setting?.enabled === true && String(setting?.value) === 'true';
}
