import { Response } from 'express';
import { catchAsync } from '@utils';
import { ExtRequest } from '@types';
import { HttpStatus, ApiError } from '@utils';
import * as shareService from '@services/share.service';

const createShare = catchAsync(async (req: ExtRequest, res: Response) => {
    const { checkId } = req.params;
    if (!checkId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Check ID is required');
    }
    if (!req.user) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
    }

    const result = await shareService.createShareToken(checkId, req.user);
    res.status(HttpStatus.OK).json(result);
});

const validateShare = catchAsync(async (req: ExtRequest, res: Response) => {
    const { checkId } = req.params;
    const { token } = req.query;

    if (!checkId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Check ID is required');
    }
    if (!token || typeof token !== 'string') {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Share token is required');
    }

    const isValid = await shareService.validateShareToken(checkId, token);
    res.status(HttpStatus.OK).json({ valid: isValid });
});

const revokeShare = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Share token ID is required');
    }
    if (!req.user) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
    }

    await shareService.revokeShareToken(id, req.user);
    res.status(HttpStatus.OK).json({ success: true });
});

const getShareTokens = catchAsync(async (req: ExtRequest, res: Response) => {
    const { checkId } = req.params;
    if (!checkId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Check ID is required');
    }

    const tokens = await shareService.getShareTokensForCheck(checkId);
    res.status(HttpStatus.OK).json({ results: tokens });
});

const revokeAllForCheck = catchAsync(async (req: ExtRequest, res: Response) => {
    const { checkId } = req.params;
    if (!checkId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Check ID is required');
    }
    if (!req.user) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
    }

    const count = await shareService.revokeAllTokensForCheck(checkId, req.user);
    res.status(HttpStatus.OK).json({ success: true, revokedCount: count });
});

export {
    createShare,
    validateShare,
    revokeShare,
    getShareTokens,
    revokeAllForCheck,
};
