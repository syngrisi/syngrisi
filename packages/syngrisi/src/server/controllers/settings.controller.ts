/* eslint-disable @typescript-eslint/no-explicit-any */
import { catchAsync } from '../utils';

const AppSettings = (global as any).AppSettings
const getSettings = catchAsync(async (req: any, res: any) => {
    const result = AppSettings.cache;
    res.json(result);
});

const updateSetting = catchAsync(async (req: any, res: any) => {
    const { name } = req.params;
    await AppSettings.set(name, req.body.value);
    if (req.body.enabled === false) {
        await AppSettings.disable(name);
    } else {
        await AppSettings.enable(name);
    }
    res.json({ message: 'success' });
});

export {
    getSettings,
    updateSetting,
};
