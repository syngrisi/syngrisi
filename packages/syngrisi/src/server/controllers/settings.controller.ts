import { ExtRequest } from '@types';
import { catchAsync } from '@utils';
import { Response } from "express";
import { appSettings } from "@settings";

const getSettings = catchAsync(async (req: ExtRequest, res: Response) => {
    const AppSettings = appSettings;
    const result = AppSettings.cache;
    res.json(result);
});

const updateSetting = catchAsync(async (req: ExtRequest, res: Response) => {
    const AppSettings = appSettings;

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
