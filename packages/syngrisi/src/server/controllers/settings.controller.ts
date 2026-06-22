import { ExtRequest } from '@types';
import { catchAsync } from '@utils';
import { Response } from "express";
import { appSettings } from "@settings";

const getSettings = catchAsync(async (req: ExtRequest, res: Response) => {
    const AppSettings = appSettings;
    // Mask write-only secrets (AI provider API key) without mutating the cache.
    const result = AppSettings.cache.map((s: any) => {
        if (s.name === 'ai_triage_provider' && s.value && typeof s.value === 'object') {
            return { ...s, value: { ...s.value, apiKey: s.value.apiKey ? '***' : '' } };
        }
        return s;
    });
    res.json(result);
});

import { env } from '@env';

const getPublicSettings = catchAsync(async (req: ExtRequest, res: Response) => {
    const AppSettings = appSettings;
    const result = AppSettings.cache.filter((x: any) => ['share_enabled'].includes(x.name));
    result.push({
        name: 'rca_enabled',
        value: env.SYNGRISI_RCA,
        enabled: true,
    });
    res.json(result);
});

const updateSetting = catchAsync(async (req: ExtRequest, res: Response) => {
    const AppSettings = appSettings;

    const { name } = req.params;
    let value = req.body.value;
    // Preserve the stored AI provider API key when the client sends a masked/empty placeholder.
    if (name === 'ai_triage_provider' && value && typeof value === 'object') {
        if (!value.apiKey || value.apiKey === '***') {
            const existing = (await AppSettings.get('ai_triage_provider'))?.value;
            value = { ...value, apiKey: (existing && typeof existing === 'object' ? existing.apiKey : '') || '' };
        }
    }
    await AppSettings.set(name, value);
    if (req.body.enabled === false) {
        await AppSettings.disable(name);
    } else {
        await AppSettings.enable(name);
    }
    res.json({ message: 'success' });
});

export {
    getSettings,
    getPublicSettings,
    updateSetting,
};
