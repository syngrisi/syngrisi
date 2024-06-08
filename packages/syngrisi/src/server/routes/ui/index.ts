/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response } from 'express';
import path from 'path';
import httpStatus from 'http-status';

import { catchAsync } from '@utils';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { ExtRequest } from '../../../types/ExtRequest';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();
const rootDir = path.resolve(process.cwd());

const staticIndex = async (req: ExtRequest, res: Response) => {
    res.status(httpStatus.OK)
        .sendFile(path.normalize(path.join(rootDir, `/mvc/views/react/index2/index.html`)));
}

router.get(
    '',
    ensureLoggedIn(),
    catchAsync(staticIndex) as Midleware
);

export default router;
