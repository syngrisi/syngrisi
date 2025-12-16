import config from '@config';
import { http } from '@shared/lib/http';

export interface ShareToken {
    _id: string;
    checkId: string;
    createdById: string;
    createdByUsername: string;
    createdDate: string;
    isRevoked: boolean;
}

export interface CreateShareResult {
    token: string;
    shareUrl: string;
    shareTokenId: string;
}

export const ShareService = {
    async createShareToken(checkId: string): Promise<CreateShareResult> {
        const url = `${config.baseUri}/v1/share/checks/${checkId}/share`;
        const resp = await http.post(url, {}, {}, 'ShareService.createShareToken');
        return resp.json();
    },

    async validateShareToken(checkId: string, token: string): Promise<{ valid: boolean }> {
        const url = `${config.baseUri}/v1/share/checks/${checkId}/share/validate?token=${encodeURIComponent(token)}`;
        const resp = await http.get(url, {}, 'ShareService.validateShareToken');
        return resp.json();
    },

    async getShareTokens(checkId: string): Promise<{ results: ShareToken[] }> {
        const url = `${config.baseUri}/v1/share/checks/${checkId}/share`;
        const resp = await http.get(url, {}, 'ShareService.getShareTokens');
        return resp.json();
    },

    async revokeShareToken(tokenId: string): Promise<{ success: boolean }> {
        const url = `${config.baseUri}/v1/share/${tokenId}`;
        const resp = await http.delete(url, {}, 'ShareService.revokeShareToken');
        return resp.json();
    },

    async revokeAllTokensForCheck(checkId: string): Promise<{ success: boolean; revokedCount: number }> {
        const url = `${config.baseUri}/v1/share/checks/${checkId}/share/all`;
        const resp = await http.delete(url, {}, 'ShareService.revokeAllTokensForCheck');
        return resp.json();
    },
};
