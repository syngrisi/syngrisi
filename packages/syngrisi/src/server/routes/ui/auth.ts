/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import path from 'path';
import httpStatus from 'http-status';

import { catchAsync } from '@utils';
import { Midleware } from '@types/Midleware';

const router = express.Router();
const rootDir = path.resolve(process.cwd());


const authController = catchAsync(async (req: Request, res: Response) => {
    res.status(httpStatus.OK)
    // .sendFile(path.normalize(path.join(`${__dirname}./../../../../mvc/views/react/auth/index.html`)));
    .sendFile(path.normalize(path.join(rootDir, `/mvc/views/react/auth/index.html`)));

});

router.get('*', authController as Midleware);

export default router;
