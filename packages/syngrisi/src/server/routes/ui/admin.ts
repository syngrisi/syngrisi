/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import path from 'path';
import httpStatus from 'http-status';

import { catchAsync } from '@utils';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();
const rootDir = path.resolve(__dirname, '..', '..');


const adminController = catchAsync(async (req: Request, res: Response) => {
    res.status(httpStatus.OK)
        // .sendFile(path.normalize(path.join(`${__dirname}./../../../../mvc/views/react/admin/index.html`)));
        .sendFile(path.normalize(path.join(rootDir, `/mvc/views/react/admin/index.html`)));

});

router.get(
    '*',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    adminController as Midleware
);

export default router;
