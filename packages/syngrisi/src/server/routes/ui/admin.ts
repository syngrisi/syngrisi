/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import path from 'path';
import httpStatus from 'http-status';

import { catchAsync } from '@utils';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares';
import { Midleware } from '../../../types/Midleware';
import { baseDir } from '@lib/baseDir';

const router = express.Router();

const adminController = catchAsync(async (req: Request, res: Response) => {
    res.status(httpStatus.OK)
        .sendFile(path.normalize(path.join(baseDir, `./mvc/views/react/admin/index.html`)));

});

router.get(
    /.*/,
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    adminController as Midleware
);

export default router;
