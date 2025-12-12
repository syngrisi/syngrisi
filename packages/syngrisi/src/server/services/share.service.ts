import { hashSync, generateApiKey } from '@utils/hash';
import { ShareToken, Check } from '@models';
import log from '@lib/logger';
import { RequestUser } from '@types';
import { ApiError, HttpStatus } from '@utils';

const logOpts = { scope: 'shareService', msgType: 'SHARE', itemType: 'shareToken' };

interface CreateShareTokenResult {
    token: string;
    shareUrl: string;
    shareTokenId: string;
}

const createShareToken = async (
    checkId: string,
    user: RequestUser
): Promise<CreateShareTokenResult> => {
    const opts = { ...logOpts, user: user.username, ref: checkId };

    log.info(`Creating share token for check: '${checkId}'`, opts);

    // Verify check exists
    const check = await Check.findById(checkId).exec();
    if (!check) {
        log.error(`Check not found: '${checkId}'`, opts);
        throw new ApiError(HttpStatus.NOT_FOUND, `Check not found: ${checkId}`);
    }

    // Generate token
    const rawToken = generateApiKey();
    const hashedToken = hashSync(rawToken);

    // Create share token record
    const shareToken = await ShareToken.create({
        checkId,
        token: hashedToken,
        createdById: user._id,
        createdByUsername: user.username,
        createdDate: new Date(),
        isRevoked: false,
    });

    log.info(`Share token created: '${shareToken._id}' for check: '${checkId}'`, opts);

    return {
        token: rawToken,
        shareUrl: `/?checkId=${checkId}&modalIsOpen=true&share=${rawToken}`,
        shareTokenId: String(shareToken._id),
    };
};

const validateShareToken = async (
    checkId: string,
    rawToken: string
): Promise<any> => {
    const hashedToken = hashSync(rawToken);

    const shareToken = await ShareToken.findOne({
        checkId,
        token: hashedToken,
        isRevoked: false,
    }).exec();

    if (shareToken) {
        log.debug(`Valid share token used for check: '${checkId}'`, logOpts);
        return shareToken;
    }

    log.debug(`Invalid or revoked share token for check: '${checkId}'`, logOpts);
    return null;
};

const revokeShareToken = async (
    shareTokenId: string,
    user: RequestUser
): Promise<void> => {
    const opts = { ...logOpts, user: user.username, ref: shareTokenId };

    log.info(`Revoking share token: '${shareTokenId}'`, opts);

    const shareToken = await ShareToken.findByIdAndUpdate(
        shareTokenId,
        {
            isRevoked: true,
            revokedDate: new Date(),
            revokedById: user._id,
            revokedByUsername: user.username,
        },
        { new: true }
    ).exec();

    if (!shareToken) {
        log.error(`Share token not found: '${shareTokenId}'`, opts);
        throw new ApiError(HttpStatus.NOT_FOUND, `Share token not found: ${shareTokenId}`);
    }

    log.info(`Share token revoked: '${shareTokenId}'`, opts);
};

const getShareTokensForCheck = async (checkId: string) => {
    return ShareToken.find({ checkId, isRevoked: false })
        .sort({ createdDate: -1 })
        .exec();
};

const revokeAllTokensForCheck = async (
    checkId: string,
    user: RequestUser
): Promise<number> => {
    const opts = { ...logOpts, user: user.username, ref: checkId };

    log.info(`Revoking all share tokens for check: '${checkId}'`, opts);

    const result = await ShareToken.updateMany(
        { checkId, isRevoked: false },
        {
            isRevoked: true,
            revokedDate: new Date(),
            revokedById: user._id,
            revokedByUsername: user.username,
        }
    ).exec();

    log.info(`Revoked ${result.modifiedCount} tokens for check: '${checkId}'`, opts);

    return result.modifiedCount;
};

const findShareToken = async (
    rawToken: string
): Promise<any> => {
    const hashedToken = hashSync(rawToken);

    const shareToken = await ShareToken.findOne({
        token: hashedToken,
        isRevoked: false,
    }).exec();

    if (shareToken) {
        log.debug(`Found share token: '${shareToken._id}'`, logOpts);
        return shareToken;
    }

    log.debug('Share token not found or revoked', logOpts);
    return null;
};

export {
    createShareToken,
    validateShareToken,
    revokeShareToken,
    getShareTokensForCheck,
    revokeAllTokensForCheck,
    findShareToken,
};
