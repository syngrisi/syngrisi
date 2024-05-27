/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import path from 'path';
import httpStatus from 'http-status';

import { catchAsync } from '../../utils';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();
const rootDir = path.resolve(process.cwd());

router.get(
    '',
    ensureLoggedIn(),
    catchAsync(async (req: Request, res: Response) => {
        res.status(httpStatus.OK)
            .sendFile(path.normalize(path.join(rootDir, `/mvc/views/react/index2/index.html`)));
    })
);

export default router;
