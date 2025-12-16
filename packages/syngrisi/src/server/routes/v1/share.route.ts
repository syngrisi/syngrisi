import express from 'express';
import * as shareController from '@controllers/share.controller';
import { Midleware } from '@types';
import { ensureLoggedIn, ensureLoggedInOrApiKey } from '@middlewares/ensureLogin/ensureLoggedIn';

const router = express.Router();

// Create share token (requires auth)
router.post(
    '/checks/:checkId/share',
    ensureLoggedIn(),
    shareController.createShare as Midleware
);

// Validate share token (public - for anonymous access)
router.get(
    '/checks/:checkId/share/validate',
    shareController.validateShare as Midleware
);

// Get all active share tokens for a check (requires auth)
router.get(
    '/checks/:checkId/share',
    ensureLoggedInOrApiKey(),
    shareController.getShareTokens as Midleware
);

// Revoke specific share token (requires auth)
router.delete(
    '/:id',
    ensureLoggedIn(),
    shareController.revokeShare as Midleware
);

// Revoke all tokens for a check (requires auth)
router.delete(
    '/checks/:checkId/share/all',
    ensureLoggedIn(),
    shareController.revokeAllForCheck as Midleware
);

export default router;
