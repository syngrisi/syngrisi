/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import path from 'path';
import { HttpStatus } from '@utils';

import { catchAsync } from '@utils';
import { ExtRequest } from '@types';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares';
import { Midleware } from '../../../types/Midleware';
import { baseDir } from '@lib/baseDir';
import { appSettings } from "@settings";

const router = express.Router();

const adminController = catchAsync(async (req: ExtRequest, res: Response) => {
    // Extra guard to ensure only admins can access this UI when auth is enabled
    const AppSettings = appSettings;
    const authEnabled = await AppSettings.isAuthEnabled();



    if (authEnabled && req.user?.role !== 'admin') {
        return res.status(HttpStatus.FORBIDDEN).send('Authorization Error - wrong Role');
    }

    res.status(HttpStatus.OK)
        .sendFile(path.normalize(path.join(baseDir, `./mvc/views/react/admin/index.html`)));

});

router.get(
    /.*/,
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    adminController as Midleware
);

export default router;
