/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import path from 'path';
import { HttpStatus } from '@utils';

import { catchAsync } from '@utils';
import { Midleware } from '@types';
import { baseDir } from '@lib/baseDir';

const router = express.Router();

const authController = catchAsync(async (req: Request, res: Response) => {
    res.status(HttpStatus.OK)
        .sendFile(path.normalize(path.join(baseDir, `./mvc/views/react/auth/index.html`)));

});

router.get(/.*/, authController as Midleware);

export default router;
